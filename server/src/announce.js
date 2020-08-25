const { verify } = require('sodium-signatures');
const debug = require('debug')('u-wave-hub');
const { json, send } = require('micro');
const helmet = require('micro-helmet');
const ms = require('ms');
const servers = require('./store');
const validators = require('./validators');

const removeTimeout = ms('1 day');

function prune() {
  debug('prune');
  servers.deleteBefore(Date.now() - removeTimeout).catch((err) => {
    debug('error while pruning', err);
  });
}

async function announce(req, res) {
  await helmet.addHeaders(req, res);

  const { params } = req;
  if (!validators.announce.params(params)) {
    throw validators.error(validators.announce.params.errors);
  }
  const body = await json(req);
  if (!validators.announce.body(body)) {
    throw validators.error(validators.announce.body.errors);
  }

  const publicKey = Buffer.from(params.publicKey, 'hex');
  const data = Buffer.from(body.data, 'utf8');
  const signature = Buffer.from(body.signature, 'hex');

  const serverId = publicKey.toString('hex');

  if (!verify(data, signature, publicKey)) {
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

  if (!validators.announceData(object)) {
    throw validators.error(validators.announceData.errors);
  }

  await servers.update(serverId, {
    ping: Date.now(),
    data: object,
  });

  debug('announce', serverId);

  prune();

  const server = await servers.get(serverId);
  send(res, 200, {
    received: server.data,
  });
}

announce.path = '/announce/{publicKey}';
announce.openapi = {
  post: {
    description: 'Announce the existence of a server',
    operationId: 'announce',
    responses: {
      200: {
        description: 'Announced successfully',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                received: validators.announceData.schema,
              },
            },
          },
        },
      },
    },
    parameters: [{
      name: 'publicKey',
      in: 'path',
      description: 'The public key of the server',
      required: true,
      schema: validators.announce.params.schema.properties.publicKey,
    }],
    requestBody: {
      description: 'Server state data',
      content: {
        'application/json': {
          schema: validators.announce.body.schema,
        },
      },
    },
  },
};

module.exports = announce;
