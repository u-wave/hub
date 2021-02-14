const {
  router, get, options, post,
} = require('micro-fork');
const { createError } = require('micro');
const controller = require('./controller');

function fourOhFour() {
  throw createError(404, 'Not Found');
}

module.exports = router({
  defaultRoute: fourOhFour,
})(
  post('/announce/:publicKey', controller.announce),

  options('/events', controller.events),
  get('/events', controller.events),

  options('/openapi.json', controller.openapi),
  get('/openapi.json', controller.openapi),

  options('/', controller.list),
  get('/', controller.list),
);
