const Store = process.env.FIRESTORE_PROJECT ? require('./firebase') : require('./memory');

module.exports = new Store();
