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
export function loadServers(hubServer) {
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

/**
 * @param {string} hubServer
 * @param {(servers: Server[]) => void} notify
 * @return {{ remove: () => void }}
 */
export function announceEvents(hubServer, notify) {
  const source = new EventSource(`${hubServer.replace(/\/$/, '')}/events`);

  const listener = (event) => {
    let data;
    try {
      data = JSON.parse(event.data);
    } catch (err) {
      return;
    }

    notify(data);
  };
  source.addEventListener('message', listener);

  const remove = () => {
    source.removeEventListener('message', listener);
    source.close();
  };

  return { remove };
}
