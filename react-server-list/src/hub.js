/* global globalThis */
import nodeFetch from 'node-fetch';

const fetch = globalThis.fetch || nodeFetch;

const downTimeout = 600_000; // 10 minutes

/**
 *
 *
 * @typedef {object} Media
 * @prop {string} title - Title of the media.
 * @prop {string} artist - Artist, creator, or uploader of the media.
 * @prop {string} thumbnail - A full HTTP(S) URL to a thumbnail for the media.
 */

/**
 * @typedef {object} Booth
 * @prop {string} dj - Username of the current DJ.
 * @prop {Media} media - The currently playing media.
 */

/**
 * @typedef {object} Server
 * @prop {string} name - Name of the server.
 * @prop {string} subtitle - A short description for the server.
 * @prop {string} [description] - Long-form description for the server. May contain Markdown.
 * @prop {string} url - Web-accessible URL to this server,
 *     hosting eg. the web client or a home page.
 * @prop {number} timeSincePing - Time in milliseconds since the most recent update from this
 *     server.
 * @prop {Booth} [booth]
 */

/**
 * @param {string} hubServer - URL of the announce server.
 * @return {Promise<Server[]>}
 */
export function loadServers(hubServer) { // eslint-disable-line import/prefer-default-export
  return fetch(hubServer)
    .then((response) => (/** @type {Promise<{ servers: Server[] }>} */ (response.json())))
    .then((state) => (
      state.servers.sort((a, b) => {
        if (a.timeSincePing >= downTimeout) {
          return 1;
        }
        if (b.timeSincePing >= downTimeout) {
          return -1;
        }
        return 0;
      })
    ));
}
