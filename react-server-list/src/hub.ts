/* global globalThis */
import nodeFetch from 'node-fetch';
import ms from 'ms';

const fetch = globalThis.fetch || nodeFetch;

const downTimeout = ms('10 minutes');

export type Media = {
  /** Title of the media. */
  title: string,
  /** Artist, creator, or uploader of the media. */
  artist: string,
  /** A full HTTP(S) URL to a thumbnail for the media. */
  thumbnail: string,
};

export type Booth = {
  /** Username of the current DJ. */
  dj: string,
  /** The currently playing media. */
  media: Media,
};

export type Server = {
  /** Name of the server. */
  name: string,
  /** A short description for the server. */
  subtitle: string,
  /** Long-form description for the server. May contain Markdown. */
  description?: string|null,
  /** Web-accessible URL to this server, hosting eg. the web client or a home page. */
  url: string,
  /** Time in milliseconds since the most recent update from this server. */
  timeSincePing: number,
  booth?: Booth|null,
};

export async function loadServers(hubServer: string): Promise<Server[]> {
  const response = await fetch(hubServer);
  const state: { servers: Server[] } = await response.json();
  return state.servers.sort((a, b) => {
    if (a.timeSincePing >= downTimeout) {
      return 1;
    }
    if (b.timeSincePing >= downTimeout) {
      return -1;
    }
    return 0;
  });
}
