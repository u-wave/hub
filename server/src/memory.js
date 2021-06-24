import EventEmitter from 'events';
import createDebug from 'debug';

const debug = createDebug('u-wave-hub');

export default class InMemoryStore extends EventEmitter {
  constructor() {
    super();
    this.backend = new Map();
  }

  async update(id, { ping, data }) {
    this.backend.set(id, { ping, data });
    this.emit('update', id, data);
  }

  async get(id) {
    return this.backend.get(id);
  }

  async* list() {
    yield* this.backend.entries();
  }

  async deleteBefore(staleTimestamp) {
    this.backend.forEach((server, publicKey) => {
      if (server.ping < staleTimestamp) {
        debug('prune', publicKey);
        this.backend.delete(publicKey);
      }
    });
  }
};
