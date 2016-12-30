import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import ms from 'ms';

import * as controller from './controller';

module.exports = function hub() {
  const app = express();

  app.use(bodyParser.json());

  app.options(cors());
  app.use(cors());

  app.post('/announce', controller.announce);
  app.get('/', controller.list);

  // Cleanup
  setInterval(() => {
    controller.prune();
  }, ms('1 minute'));

  return app;
}
