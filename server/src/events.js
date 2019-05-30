const SSE = require('sse-writer')
const once = require('once')
const servers = require('./store')

const bus = new Set()

function onUpdate (serverId, server) {
  bus.forEach((notify) => {
    notify({ publicKey: serverId, ...server })
  })
}

module.exports = function events (req, res) {
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
