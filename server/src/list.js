const { send } = require('micro')
const helmet = require('micro-helmet')
const cors = require('micro-cors')
const servers = require('./store')

const enhance = cors({ allowedMethods: ['GET'] })

module.exports = enhance(async function list (req, res) {
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
