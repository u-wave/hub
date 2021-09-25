import { on } from 'events';

/**
 * @param {import('fastify').Fastify} fastify
 */
export default async function eventsPlugin(fastify) {
  async function* events() {
    let id = 0;

    for await (const [serverId, server] of on(fastify.store, 'update')) {
      yield {
        id,
        data: JSON.stringify({
          publicKey: serverId,
          ...server
        }),
      };
      id += 1;
    }
  }

  fastify.get('/events', {
    description: 'Listen for updates announced by servers',
  }, (request, reply) => {
    reply.sse(events());
  });
}
