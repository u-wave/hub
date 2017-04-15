import ms from 'ms';
import createDebug from 'debug';
import pify from 'pify';
import joi from 'joi';
import { verify } from 'sodium-signatures';
import * as validators from './validators';

const validate = pify(joi.validate);
const debug = createDebug('u-wave-hub');

const servers = new Map();

async function announceP(req, res) {
  const publicKey = Buffer.from(req.params.publicKey, 'hex');
  const data = Buffer.from(req.body.data, 'utf8');
  const signature = Buffer.from(req.body.signature, 'hex');

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

  object = await validate(object, validators.announceData, {
    allowUnknown: true,
    stripUnknown: true,
  });

  servers.set(serverId, {
    ping: Date.now(),
    data: object,
  });

  debug('announce', serverId);

  const server = servers.get(serverId);
  res.json({
    received: server.data,
  });
}

export function announce(req, res, next) {
  announceP(req, res).catch(next);
}

export function list(req, res) {
  const response = [];

  servers.forEach((server, publicKey) => {
    response.push(Object.assign(
      {},
      server.data,
      { publicKey }
    ));
  });

  res.json({
    servers: response,
  });
}

export function prune() {
  debug('prune');
  servers.forEach((server, publicKey) => {
    if (server.ping + ms('5 minutes') < Date.now()) {
      debug('prune', publicKey);
      servers.delete(publicKey);
    }
  });
}
