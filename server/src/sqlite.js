import EventEmitter from 'events';
import { DatabaseSync } from 'node:sqlite';

const MIGRATIONS = [
  `
    CREATE TABLE entries (
      key BLOB NOT NULL PRIMARY KEY,
      last_ping INTEGER NOT NULL,
      data JSON NOT NULL
    );
  `,
];

/** @typedef {import('./store').Store} Store */
/** @typedef {import('./store').StoreEntry} StoreEntry */
/** @implements {Store} */
export default class SqliteStore extends EventEmitter {
  /** @param {URL} url */
  constructor(url) {
    super();

    this.db = new DatabaseSync(url.pathname || ':memory:');

    this.db.exec('BEGIN');
    try {
      let version = this.db.prepare('PRAGMA user_version').get().user_version;
      for (; version < MIGRATIONS.length; version += 1) {
        this.db.exec(MIGRATIONS[0]);
      }
      this.db.prepare(`PRAGMA user_version = ${version}`).run();
      this.db.exec('COMMIT');
    } catch (error) {
      this.db.exec('ROLLBACK');
      throw error;
    }

    this.updateStmt = this.db.prepare('REPLACE INTO entries (key, last_ping, data) VALUES (:key, :ping, :data)');
    this.deleteStmt = this.db.prepare('DELETE FROM entries WHERE last_ping < ?');
    this.getStmt = this.db.prepare('SELECT last_ping AS ping, data FROM entries WHERE key = ?');
    this.listStmt = this.db.prepare('SELECT key, last_ping AS ping, data FROM entries');
  }

  /**
   * @param {string} id
   * @param {StoreEntry} entry
   */
  async update(id, { ping, data }) {
    this.updateStmt.run({
      key: id,
      ping,
      data: JSON.stringify(data),
    });
  }

  /** @param {Record<string, import('node:sqlite').SQLOutputValue>} row */
  #parseRow(row) {
    return /** @type {StoreEntry} */ ({
      ping: row.ping,
      data: JSON.parse(/** @type {string} */ (row.data)),
    });
  }

  /**
   * @param {string} id
   */
  async get(id) {
    const result = this.getStmt.get(id);
    if (result == null) {
      return undefined;
    }

    return this.#parseRow(result);
  }

  async* list() {
    const it = this.listStmt.all();
    for (const row of it) {
      const key = /** @type {string} */ (row.key);
      const data = this.#parseRow(row);
      yield /** @type {[string, StoreEntry]} */ ([key, data]);
    }
  }

  /**
   * @param {number} staleTimestamp
   */
  async deleteBefore(staleTimestamp) {
    this.deleteStmt.run(staleTimestamp);
  }
}
