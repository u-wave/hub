import fetch from 'node-fetch';
import ms from 'ms';

const downTimeout = ms('10 minutes');

/**
 * @typedef {object} Media
 * @prop {string} title
 * @prop {string} artist
 * @prop {string} thumbnail
 */

/**
 * @typedef {object} Booth
 * @prop {string} dj
 * @prop {Media} media
 */

/**
 * @typedef {object} Server
 * @prop {string} name
 * @prop {string} subtitle
 * @prop {string} [description]
 * @prop {string} url
 * @prop {number} timeSincePing
 * @prop {Booth} [booth]
 */

/**
 * @param {string} hubServer
 * @return {Promise<Server[]>}
 */
export function loadServers(hubServer) { // eslint-disable-line import/prefer-default-export
  return fetch(hubServer)
    .then((response) => response.json())
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
