import { send } from 'micro';
import helmet from 'micro-helmet';
import cors from 'micro-cors';
import fs from 'fs/promises';
import announce from './announce.js';
import events from './events.js';
import list from './list.js';

const pkg = JSON.parse(await fs.readFile(new URL('../package.json', import.meta.url)));
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

  if (req.method === 'OPTIONS') {
    send(res, 200);
    return;
  }

  send(res, 200, definition);
}

export default enhance(openapi);
