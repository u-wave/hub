const { send } = require('micro');
const helmet = require('micro-helmet');
const cors = require('micro-cors');
const announce = require('./announce');
const events = require('./events');
const list = require('./list');
const pkg = require('../package.json');

const enhance = cors({ allowedMethods: ['GET'] });

const definition = {
  openapi: '3.0.3',
  info: {
    title: 'üWave Announce',
    version: pkg.version,
    license: {
      name: 'MIT',
      url: 'https://github.com/u-wave/hub/blob/default/LICENSE',
    },
  },
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
