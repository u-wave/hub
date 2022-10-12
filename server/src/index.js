import { URL } from 'url';
import { env } from 'process';
import { readFile } from 'fs/promises';
import Fastify from 'fastify';
import plugin from 'fastify-plugin';
import AjvCompiler from '@fastify/ajv-compiler';
import ajvFormats from 'ajv-formats';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import rateLimit from '@fastify/rate-limit';
import { FastifySSEPlugin } from 'fastify-sse-v2';
import announce from './announce.js';
import list from './list.js';
import events from './events.js';

const pkg = JSON.parse((await readFile(new URL('../package.json', import.meta.url))).toString());

export default function hubServer() {
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

  app.register(cors);
  app.register(helmet);
  app.register(rateLimit, { max: 100, timeWindow: '1 minute' });
  app.register(FastifySSEPlugin);
  app.register(swagger, {
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
  });
  app.register(swaggerUi, {
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
  }, async (_request, reply) => {
    reply.redirect('/documentation/json');
  });

  return app;
}
