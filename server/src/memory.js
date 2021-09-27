import EventEmitter from 'events';
import createDebug from 'debug';

const debug = createDebug('u-wave-hub');

/** @typedef {import('./store').Store} Store */
/** @implements {Store} */
export default class InMemoryStore extends EventEmitter {
  constructor() {
    super();
    /** @type {Map<string, import('./store').StoreEntry>} */
    this.backend = new Map();
  }

  /**
   * @param {string} id
   * @param {import('./store').StoreEntry} entry
   */
  async update(id, { ping, data }) {
    this.backend.set(id, { ping, data });
    this.emit('update', id, data);
  }

  /**
   * @param {string} id
   */
  async get(id) {
    return this.backend.get(id);
  }

  async* list() {
    yield* this.backend.entries();
  }

  /**
   * @param {number} staleTimestamp
   */
  async deleteBefore(staleTimestamp) {
    for (const [publicKey, server] of this.backend) {
      if (server.ping < staleTimestamp) {
        debug('prune', publicKey);
        this.backend.delete(publicKey);
      }
    }
  }
}
