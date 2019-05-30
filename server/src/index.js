const { router, get, post } = require('microrouter')
const micro = require('micro')
const controller = require('./controller')

module.exports = router(
  post('/announce/:publicKey', controller.announce),
  get('/events', controller.events),
  get('/', controller.list)
)
