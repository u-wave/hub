import ms from 'ms';
import createDebug from 'debug';

const debug = createDebug('u-wave-hub');

const servers = new Map();

export function announce(req, res) {
  const data = req.body;

  servers.set(req.ip, {
    ping: Date.now(),
    data,
  });

  debug('announce', req.ip);

  const server = servers.get(req.ip);
  res.json({
    received: server.data,
  });
}

export function list(req, res) {
  const response = [];

  servers.forEach((value) => {
    response.push(value.data);
  });

  res.json({
    servers: response,
  });
}

export function prune() {
  debug('prune');
  servers.forEach((server, url) => {
    if (server.ping + ms('5 minutes') < Date.now()) {
      debug('prune', url);
      servers.delete(url);
    }
  });
}
