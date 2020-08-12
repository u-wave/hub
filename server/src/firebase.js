const Firestore = require('@google-cloud/firestore');
const { PassThrough } = require('stream');
const EventEmitter = require('events');
const createDebug = require('debug');

const debug = createDebug('u-wave-hub');

module.exports = class FirebaseStore extends EventEmitter {
  constructor() {
    super();

    this.backend = new Firestore({
      projectId: process.env.FIRESTORE_PROJECT,
      credentials: JSON.parse(process.env.FIRESTORE_CREDENTIALS),
    });
    this.collection = this.backend.collection('u-wave-servers');

    let isFirst = true;
    this.collection.onSnapshot((snapshot) => {
      debug('query snapshot', snapshot.size);
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

  async update(id, { ping, data }) {
    await this.collection.doc(id).set({ ping, data });
  }

  async get(id) {
    const doc = await this.collection.doc(id).get();
    return doc.data();
  }

  async* list() {
    const newStream = this.collection.stream()
      .pipe(new PassThrough({ objectMode: true }));
    for await (const doc of newStream) {
      yield [doc.id, doc.data()];
    }
  }

  async deleteBefore(staleTimestamp) {
    const query = () => this.collection.where('ping', '<', staleTimestamp).limit(100).get();
    /* eslint-disable no-await-in-loop */
    while (true) {
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
};
