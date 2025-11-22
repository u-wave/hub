import { URL } from 'url';
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
import { version } from '../package.json' with { type: 'json' };
import announce from './announce.js';
import list from './list.js';
import events from './events.js';

/**
 * @param {{ store?: string }} [opts]
 */
export default function hubServer(opts) {
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
        version,
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
    let module;
    const store = new URL(opts?.store ?? 'sqlite:');
    switch (store.protocol) {
      case 'sqlite:':
        module = await import('./sqlite.js');
        break;
      case 'firestore:':
        module = await import('./firebase.js');
        break;
      default:
        throw new Error(`unsupported store "${store.protocol}"`);
    }

    const { default: Store } = module;

    fastify.decorate('store', new Store(store));
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
