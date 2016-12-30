import got from 'got';
import ms from 'ms';

function stripSlashes(url) {
  return url.replace(/\/+$/, '');
}

module.exports = function announcePlugin(options) {
  const hubHost = options.hub || 'https://u-wave-announce.now.sh';
  const url = stripSlashes(options.url);

  const announceUrl = `${stripSlashes(hubHost)}/announce`;

  return (uw) => {
    async function announce() {
      // TODO add something to üWave Core so we don't have to manually populate
      // the relationships.
      const entry = await uw.booth.getCurrentEntry();
      entry.populate('user media.media');
      await entry.execPopulate();

      await got.post(announceUrl, {
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          booth: entry,
          name: options.name,
          description: options.description,
          url: `${url}/`,
          // Derive URLs if not given.
          apiUrl: options.apiUrl || `${url}/v1`,
          socketUrl: options.socketUrl || `${url.replace(/^http/, 'ws')}/`,
        }),
      });
    }

    announce();

    const interval = setInterval(announce, ms('1 minute'));
    uw.on('stop', () => {
      clearInterval(interval);
    });
  };
};
