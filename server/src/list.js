const { send } = require('micro')
const helmet = require('micro-helmet')
const cors = require('micro-cors')
const servers = require('./store')

const enhance = cors({ allowedMethods: ['GET'] })

const list = enhance(async function list (req, res) {
  await helmet.addHeaders(req, res)

  const response = []
  for await (const [publicKey, server] of servers.list()) {
    response.push({
      ...server.data,
      publicKey,
      timeSincePing: Date.now() - server.ping
    })
  }

  send(res, 200, {
    servers: response
  })
})

list.path = '/'
list.openapi = {
  get: {
    description: 'Show the current state of all known servers',
    responses: {
      200: {
        content: {
          'application/json': {}
        }
      }
    }
  }
}

module.exports = list
