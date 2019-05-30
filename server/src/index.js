const { promisify } = require('util')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const joi = require('joi')

const controller = require('./controller')
const validators = require('./validators')

const joiValidate = promisify(joi.validate.bind(joi))

function validate (validator) {
  return (req, res, next) => {
    const opts = {
      allowUnknown: true,
      stripUnknown: true
    }
    Promise.all([
      joiValidate(req.params, validator.params, opts),
      joiValidate(req.body, validator.body, opts)
    ]).then(([ params, body ]) => {
      req.originalParams = req.params
      req.originalBody = req.body
      req.params = params
      req.body = body
      next()
    }).catch((err) => {
      next(err)
    })
  }
}

module.exports = function hub () {
  const app = express()

  app.set('trust proxy', true)

  app.use(bodyParser.json())

  app.options(cors())
  app.use(cors())

  app.post('/announce/:publicKey', validate(validators.announce), controller.announce)
  app.get('/', controller.list)
  app.get('/events', controller.events)

  return app
}
