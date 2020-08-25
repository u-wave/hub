const { router, get, post } = require('micro-fork');
const { createError } = require('micro');
const controller = require('./controller');

function fourOhFour() {
  throw createError(404, 'Not Found');
}

module.exports = router({
  defaultRoute: fourOhFour,
})(
  post('/announce/:publicKey', controller.announce),
  get('/events', controller.events),
  get('/openapi.json', controller.openapi),
  get('/', controller.list),
);
