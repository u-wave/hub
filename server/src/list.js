import * as validators from './validators.js';

/**
 * @param {import('fastify').FastifyInstance} fastify
 */
export default async function listPlugin(fastify) {
  fastify.get('/', {
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            servers: {
              description: 'List of servers known to this hub.',
              type: 'array',
              items: validators.announceData,
            },
          },
          required: ['servers'],
        },
      },
    },
  }, async () => {
    const response = [];
    for await (const [publicKey, server] of fastify.store.list()) {
      response.push({
        ...server.data,
        publicKey,
        timeSincePing: Date.now() - server.ping,
      });
    }

    return {
      servers: response,
    };
  });
}
