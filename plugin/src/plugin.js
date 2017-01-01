import got from 'got';
import ms from 'ms';

function stripSlashes(url) {
  return url.replace(/\/+$/, '');
}

async function getAnnounceData(uw, options) {
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
    description: options.description || null,

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
  const hubHost = options.hub || 'https://u-wave-announce.now.sh';
  const url = stripSlashes(options.url);

  const announceUrl = `${stripSlashes(hubHost)}/announce`;

  return (uw) => {
    async function announce() {
      const announcement = await getAnnounceData(uw, options);

      await got.post(announceUrl, {
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(announcement),
      });
    }

    announce();

    const interval = setInterval(announce, ms('1 minute'));
    uw.on('stop', () => {
      clearInterval(interval);
    });
  };
};
