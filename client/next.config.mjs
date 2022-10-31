export const reactStrictMode = true;

export const images = {
  unoptimized: true,
};

export const env = {
  HUB_SERVER: process.env.HUB_SERVER || 'https://announce.u-wave.net',
};

export const exportPathMap = () => ({
  '/': { page: '/' },
});
