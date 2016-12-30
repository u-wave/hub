export const SERVERS_ENDPOINT = process.env.NODE_ENV === 'production'
  ? 'https://u-wave-announce.now.sh/'
  : 'http://localhost:6451/';
