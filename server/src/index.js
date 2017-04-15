import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import ms from 'ms';
import pify from 'pify';
import joi from 'joi';

import * as controller from './controller';
import * as validators from './validators';

const joiValidate = pify(joi.validate);

function validate(validator) {
  return (req, res, next) => {
    const opts = {
      allowUnknown: true,
      stripUnknown: true,
    };
    Promise.all([
      joiValidate(req.params, validator.params, opts),
      joiValidate(req.body, validator.body, opts),
    ]).then(([ params, body ]) => {
      req.originalParams = req.params;
      req.originalBody = req.body;
      req.params = params;
      req.body = body;
      next();
    }).catch((err) => {
      next(err);
    });
  };
}

module.exports = function hub() {
  const app = express();

  app.set('trust proxy', true);

  app.use(bodyParser.json());

  app.options(cors());
  app.use(cors());

  app.post('/announce/:publicKey', validate(validators.announce), controller.announce);
  app.get('/', controller.list);

  // Cleanup
  setInterval(() => {
    controller.prune();
  }, ms('1 minute'));

  return app;
}
