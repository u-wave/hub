const helmet = require('micro-helmet')
const servers = require('./store')
const SSE = require('sse-writer')
const once = require('once')

const bus = new Set()

function onUpdate (serverId, server) {
  bus.forEach((notify) => {
    notify({ publicKey: serverId, ...server })
  })
}

module.exports = async function events (req, res) {
  await helmet.addHeaders(req, res)

  const stream = new SSE()
    .retry(10000)

  let id = 0

  if (bus.size === 0) {
    servers.on('update', onUpdate)
  }

  bus.add(write)
  const remove = once(() => {
    stream.end()
    bus.delete(write)

    if (bus.size === 0) {
      servers.off('update', onUpdate)
    }
  })
  req.on('error', remove)
  res.on('error', remove)
  req.connection.on('close', remove)

  function write (event) {
    stream.event(id++, 'data', event)
  }

  return stream
}
