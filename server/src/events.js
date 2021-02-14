const { send } = require('micro');
const helmet = require('micro-helmet');
const cors = require('micro-cors');
const SSE = require('sse-writer');
const once = require('once');
const servers = require('./store');

const bus = new Set();

function onUpdate(serverId, server) {
  bus.forEach((notify) => {
    notify({ publicKey: serverId, ...server });
  });
}

const enhance = cors({ allowedMethods: ['GET'] });

const events = enhance(async (req, res) => {
  await helmet.addHeaders(req, res);

  if (req.method === 'OPTIONS') {
    send(res, 200);
    return null;
  }

  const stream = new SSE()
    .retry(10000);

  let id = 0;

  if (bus.size === 0) {
    servers.on('update', onUpdate);
  }

  function write(event) {
    stream.event(id, 'data', event);
    id += 1;
  }

  bus.add(write);
  const remove = once(() => {
    stream.end();
    bus.delete(write);

    if (bus.size === 0) {
      servers.off('update', onUpdate);
    }
  });

  req.on('error', remove);
  res.on('error', remove);
  req.connection.on('close', remove);

  return stream;
});

events.path = '/events';
events.openapi = {
  get: {
    description: 'Listen for updates announced by servers',
    operationId: 'listen',
    responses: {
      200: {
        description: 'A stream of updates',
        content: {
          'text/event-stream': {},
        },
      },
    },
  },
};

module.exports = events;
