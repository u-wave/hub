import {
  router, get, options, post,
} from 'micro-fork';
import { createError } from 'micro';
import * as controller from './controller.js';

function fourOhFour() {
  throw createError(404, 'Not Found');
}

export default router({
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
