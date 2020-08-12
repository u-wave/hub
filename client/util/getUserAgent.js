export default function getUserAgent(req) {
  if (req && req.headers) {
    return req.headers['user-agent'];
  }
  if (typeof navigator !== 'undefined' && navigator.userAgent) {
    return navigator.userAgent;
  }
  return 'all';
}
