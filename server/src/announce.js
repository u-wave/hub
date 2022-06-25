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

const removeTimeout = ms('1 day');

/**
 * @param {import('fastify').FastifyRequest<unknown>} request
 * @param {import('./store').Store} store
 */
function prune(request, store) {
  request.log.info('prune');
  store.deleteBefore(Date.now() - removeTimeout).catch((err) => {
    request.log.warn({ err }, 'error while pruning');
  });
}

/**
 * @typedef {{ publicKey: string }} AnnounceParams
 * @typedef {{ data: string, signature: string }} AnnounceBody
 * @typedef {{ Params: AnnounceParams, Body: AnnounceBody }} AnnounceInterface
 * @typedef {import('fastify').FastifyRequest<AnnounceInterface>} AnnounceRequest
 */

/**
 * @param {import('fastify').FastifyInstance} fastify
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
  }, /** @param {AnnounceRequest} request */ async (request) => {
    const publicKey = Buffer.from(request.params.publicKey, 'hex');
    const data = Buffer.from(request.body.data, 'utf8');
    const signature = Buffer.from(request.body.signature, 'hex');

    const serverId = publicKey.toString('hex');

    try {
      if (!(await verify(data, signature, publicKey))) {
        request.log.info({ serverId }, 'invalid signature');
        throw new Error('Invalid signature');
      }
    } catch (err) {
      throw Object.assign(err, { statusCode: 400 });
    }

    let object;
    try {
      object = JSON.parse(data.toString('utf8'));
    } catch (err) {
      request.log.info({ serverId }, 'invalid json');
      err.message = `Invalid JSON: ${err.message}`;
      throw err;
    }

    if (!ajv.validate(validators.announceData, object)) {
      throw Object.assign(new Error(ajv.errorsText(ajv.errors)), { statusCode: 400 });
    }

    await fastify.store.update(serverId, {
      ping: Date.now(),
      data: object,
    });
    request.log.info({ serverId }, 'announced');

    const server = await fastify.store.get(serverId);
    if (!server) {
      throw Object.assign(new Error('Unknown error while saving announce data.'), { statusCode: 500 });
    }

    prune(request, fastify.store);

    return {
      received: server.data,
    };
  });
}
