import got from 'got';
import ms from 'ms';

export default function announcePlugin(options) {
  const indexHost = options.index || 'https://uwave-index.now.sh';

  return (uw) => {
    async function announce() {
      await got.post(`${indexHost}/announce`, {
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          booth: await uw.booth.getCurrentEntry(),
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
