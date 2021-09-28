import { URL } from 'url';
import { env } from 'process';
import { readFile } from 'fs/promises';
import Fastify from 'fastify';
import plugin from 'fastify-plugin';
import AjvCompiler from '@fastify/ajv-compiler';
import ajvFormats from 'ajv-formats';
import CORS from 'fastify-cors';
import Helmet from 'fastify-helmet';
import { FastifySSEPlugin } from 'fastify-sse-v2';
import Swagger from 'fastify-swagger';
import announce from './announce.js';
import list from './list.js';
import events from './events.js';

const pkg = JSON.parse((await readFile(new URL('../package.json', import.meta.url))).toString());

const app = Fastify({
  logger: true,
  ajv: {
    customOptions: {
      removeAdditional: true,
      useDefaults: true,
      coerceTypes: true,
    },
    plugins: [ajvFormats],
  },
  schemaController: {
    compilersFactory: {
      buildValidator: AjvCompiler(),
    },
  },
});

app.register(CORS);
app.register(Helmet);
app.register(FastifySSEPlugin);
app.register(Swagger, {
  openapi: {
    info: {
      title: 'üWave Announce',
      version: pkg.version,
      license: {
        name: 'MIT',
        url: 'https://github.com/u-wave/hub/blob/default/LICENSE',
      },
    },
  },
  exposeRoute: true,
  staticCSP: true,
});

app.register(plugin(async (fastify) => {
  const { default: Store } = await (
    env.FIRESTORE_PROJECT ? import('./firebase.js') : import('./memory.js')
  );

  fastify.decorate('store', new Store());
}));

app.register(announce);
app.register(events);
app.register(list);
app.get('/openapi.json', {
  schema: { hide: true },
}, async (request, reply) => {
  reply.redirect('/documentation/json');
});

export default app;
