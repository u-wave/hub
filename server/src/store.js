import { env } from 'process';

const { default: Store } = await (
  env.FIRESTORE_PROJECT ? import('./firebase.js') : import('./memory.js')
);

export default new Store();
