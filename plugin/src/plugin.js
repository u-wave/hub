import got from 'got';
import ms from 'ms';
import { keyPair as createKeyPair, sign } from 'sodium-signatures';
import stripIndent from 'strip-indent';

function stripSlashes(url) {
  return url.replace(/\/+$/, '');
}

async function getAnnounceData(uw, options) {
  const url = stripSlashes(options.url);

  // TODO add something to üWave Core so we don't have to manually populate
  // the relationships.
  const entry = await uw.booth.getCurrentEntry();
  if (entry) {
    entry.populate('user media.media');
    await entry.execPopulate();
  }

  return {
    name: options.name,
    subtitle: options.subtitle,
    description: options.description ? stripIndent(options.description) : null,

    booth: entry ? {
      media: {
        artist: entry.media.artist,
        title: entry.media.title,
        thumbnail: entry.media.media.thumbnail,
      },
      dj: entry.user ? {
        username: entry.user.username,
      } : null,
    } : null,

    url,
    // Derive URLs if not given.
    apiUrl: options.apiUrl || `${url}/v1`,
    socketUrl: options.socketUrl || `${url.replace(/^http/, 'ws')}/`,
  };
}

module.exports = function announcePlugin(options) {
  const hubHost = options.hub || 'https://announce.u-wave.net';
  const { publicKey, secretKey } = createKeyPair(options.seed);

  const announceUrl = `${stripSlashes(hubHost)}/announce/${publicKey.toString('hex')}`;

  return (uw) => {
    async function announce() {
      const announcement = await getAnnounceData(uw, options);
      const data = JSON.stringify(announcement);
      const signature = sign(Buffer.from(data, 'utf8'), secretKey).toString('hex');

      await got.post(announceUrl, {
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ data, signature }),
      });
    }

    // Announce that we've started up and are now alive.
    announce();

    // Announce again every time the song changes.
    uw.on('advance', announce);

    // And announce periodically in the mean time to let the Hub server know
    // we're still alive.
    const interval = setInterval(announce, ms('1 minute'));
    uw.on('stop', () => {
      clearInterval(interval);
    });
  };
};
