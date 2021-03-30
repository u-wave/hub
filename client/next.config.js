exports.target = 'serverless';
exports.reactStrictMode = true;

exports.future = {
  webpack5: true,
};

exports.env = {
  HUB_SERVER: process.env.HUB_SERVER || 'https://announce.u-wave.net',
};

exports.exportPathMap = () => ({
  '/': { page: '/' },
});
