const { send } = require('micro')
const helmet = require('micro-helmet')
const servers = require('./store')

module.exports = async function list (req, res) {
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
}
