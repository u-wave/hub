import { Firestore } from '@google-cloud/firestore';
import { PassThrough } from 'stream';
import EventEmitter from 'events';

/** @typedef {import('./store').Store} Store */
/** @typedef {import('./store').StoreEntry} StoreEntry */
/** @implements {Store} */
export default class FirebaseStore extends EventEmitter {
  constructor() {
    super();

    this.backend = new Firestore({
      projectId: process.env.FIRESTORE_PROJECT,
      credentials: JSON.parse(process.env.FIRESTORE_CREDENTIALS ?? 'null'),
    });
    /** @type {import('@google-cloud/firestore').CollectionReference<StoreEntry>} */
    this.collection = this.backend.collection('u-wave-servers');

    let isFirst = true;
    this.collection.onSnapshot((snapshot) => {
      if (isFirst) {
        isFirst = false;
        return;
      }

      for (const { doc } of snapshot.docChanges()) {
        this.emit('update', doc.id, doc.data().data);
      }
    }, (err) => {
      this.emit('error', err);
    });
  }

  /**
   * @param {string} id
   * @param {StoreEntry} entry
   */
  async update(id, { ping, data }) {
    await this.collection.doc(id).set({ ping, data });
  }

  /**
   * @param {string} id
   */
  async get(id) {
    const doc = await this.collection.doc(id).get();
    return doc.data();
  }

  async* list() {
    const newStream = this.collection.stream()
      .pipe(new PassThrough({ objectMode: true }));
    for await (const doc of newStream) {
      /** @type {[string, StoreEntry]} */
      const pair = [doc.id, doc.data()];
      yield pair;
    }
  }

  /**
   * @param {number} staleTimestamp
   */
  async deleteBefore(staleTimestamp) {
    const query = () => this.collection.where('ping', '<', staleTimestamp).limit(100).get();
    /* eslint-disable no-await-in-loop */
    while (true) { // eslint-disable-line no-constant-condition
      const snapshot = await query();
      if (snapshot.size === 0) {
        break;
      }
      const batch = this.backend.batch();
      for (const { ref } of snapshot.docs) {
        batch.delete(ref);
      }
      await batch.commit();
    }
    /* eslint-enable no-await-in-loop */
  }
}
