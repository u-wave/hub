const { send } = require('micro');
const helmet = require('micro-helmet');
const cors = require('micro-cors');
const announce = require('./announce');
const events = require('./events');
const list = require('./list');

const enhance = cors({ allowedMethods: ['GET'] });

const definition = {
  openapi: '3.0.3',
  paths: {},
};

definition.paths[list.path] = list.openapi;
definition.paths[events.path] = events.openapi;
definition.paths[announce.path] = announce.openapi;

async function openapi(req, res) {
  await helmet.addHeaders(req, res);

  send(res, 200, definition);
}

module.exports = enhance(openapi);
