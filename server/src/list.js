import { send } from 'micro';
import helmet from 'micro-helmet';
import cors from 'micro-cors';
import servers from './store.js';
import * as validators from './validators.js';

const enhance = cors({ allowedMethods: ['GET'] });

const list = enhance(async (req, res) => {
  await helmet.addHeaders(req, res);

  if (req.method === 'OPTIONS') {
    send(res, 200);
    return;
  }

  const response = [];
  for await (const [publicKey, server] of servers.list()) {
    response.push({
      ...server.data,
      publicKey,
      timeSincePing: Date.now() - server.ping,
    });
  }

  send(res, 200, {
    servers: response,
  });
});

list.path = '/';
list.openapi = {
  get: {
    description: 'Show the current state of all known servers',
    operationId: 'list',
    responses: {
      200: {
        description: 'List of servers known to this hub.',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: validators.announceData.schema,
            },
          },
        },
      },
    },
  },
};

export default list;
