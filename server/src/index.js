import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import ms from 'ms';
import joi from 'joi';

import * as controller from './controller';
import * as validators from './validators';

function validate(validator) {
  return (req, res, next) => {
    joi.validate(req.body, validator.body, {
      allowUnknown: true,
      stripUnknown: true,
    }, (err, value) => {
      req.originalBody = req.body;
      req.body = value;

      if (err) {
        next(err);
      } else {
        next();
      }
    });
  };
}

module.exports = function hub() {
  const app = express();

  app.use(bodyParser.json());

  app.options(cors());
  app.use(cors());

  app.post('/announce', validate(validators.announce), controller.announce);
  app.get('/', controller.list);

  // Cleanup
  setInterval(() => {
    controller.prune();
  }, ms('1 minute'));

  return app;
}
