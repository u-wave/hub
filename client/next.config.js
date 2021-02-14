exports.target = 'serverless';

exports.exportPathMap = () => ({
  '/': { page: '/' },
});

exports.env = {
  HUB_SERVER: process.env.HUB_SERVER || 'https://announce.u-wave.net',
};
