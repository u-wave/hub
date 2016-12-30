import got from 'got';
import ms from 'ms';

module.exports = function announcePlugin(options) {
  const hubHost = options.hub || 'https://u-wave-hub.now.sh';

  return (uw) => {
    async function announce() {
      // TODO add something to üWave Core so we don't have to manually populate
      // the relationships.
      const entry = await uw.booth.getCurrentEntry();
      entry.populate('user media.media');
      await entry.execPopulate();

      await got.post(`${hubHost}/announce`, {
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          booth: entry,
          name: options.name,
          description: options.description,
          url: `https://welovekpop.club/`,
          apiUrl: `https://welovekpop.club/v1`,
          socketUrl: `https://welovekpop.club/`,
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
