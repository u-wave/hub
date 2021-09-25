import createDebug from 'debug';
import Ajv from 'ajv';
import ajvFormats from 'ajv-formats';
import ms from 'ms';
import { verify } from './signatures.js';
import * as validators from './validators.js';

const ajv = new Ajv({
  removeAdditional: true,
  useDefaults: true,
  coerceTypes: true,
});
ajvFormats(ajv);

const debug = createDebug('u-wave-hub');
const removeTimeout = ms('1 day');

function prune(store) {
  debug('prune');
  store.deleteBefore(Date.now() - removeTimeout).catch((err) => {
    debug('error while pruning', err);
  });
}

/**
 * @param {import('fastify').Fastify} fastify
 */
export default async function announce(fastify) {
  fastify.post('/announce/:publicKey', {
    schema: {
      params: {
        type: 'object',
        properties: {
          publicKey: {
            description: 'The public key of the server',
            type: 'string',
            minLength: 64,
            maxLength: 64,
            pattern: '^[0-9a-fA-F]{64}$',
          },
        },
        required: ['publicKey'],
      },
      body: {
        type: 'object',
        properties: {
          data: {
            description: 'JSON-encoded string containing server data',
            type: 'string',
            contentMediaType: 'application/json',
            contentSchema: validators.announceData,
          },
          signature: {
            description: 'Sodium signature for the server data signed with the server\'s private key',
            type: 'string',
            pattern: '^[0-9a-fA-F]+$',
          },
        },
        required: ['data', 'signature'],
      },
      response: {
        200: {
          description: 'Announced successfully',
          type: 'object',
          properties: {
            received: validators.announceData,
          },
        },
      },
    },
  }, async (request) => {
    const publicKey = Buffer.from(request.params.publicKey, 'hex');
    const data = Buffer.from(request.body.data, 'utf8');
    const signature = Buffer.from(request.body.signature, 'hex');

    const serverId = publicKey.toString('hex');

    if (!(await verify(data, signature, publicKey))) {
      debug('invalid signature from', serverId);
      throw new Error('Invalid signature');
    }

    let object;
    try {
      object = JSON.parse(data.toString('utf8'));
    } catch (err) {
      debug('invalid json from', serverId);
      err.message = `Invalid JSON: ${err.message}`;
      throw err;
    }

    if (!ajv.validate(validators.announceData, object)) {
      throw validators.error(ajv.errors);
    }

    await fastify.store.update(serverId, {
      ping: Date.now(),
      data: object,
    });

    debug('announce', serverId);

    prune(fastify.store);

    const server = await fastify.store.get(serverId);
    return {
      received: server.data,
    };
  });
}
