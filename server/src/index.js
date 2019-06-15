const { router, get, post } = require('micro-fork')
const controller = require('./controller')
const { createError } = require('micro')

function fourOhFour () {
  throw createError(404, 'Not Found')
}

module.exports = router({
  defaultRoute: fourOhFour
})(
  post('/announce/:publicKey', controller.announce),
  get('/events', controller.events),
  get('/', controller.list)
)
