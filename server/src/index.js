const { router, get, post } = require('microrouter')
const controller = require('./controller')

module.exports = router(
  post('/announce/:publicKey', controller.announce),
  get('/events', controller.events),
  get('/', controller.list)
)
