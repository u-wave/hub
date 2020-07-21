const { verify } = require('sodium-signatures')
const debug = require('debug')('u-wave-hub')
const validators = require('./validators')
const { json, send } = require('micro')
const helmet = require('micro-helmet')
const servers = require('./store')
const ms = require('ms')

const removeTimeout = ms('1 day')

function prune () {
  debug('prune')
  servers.deleteBefore(Date.now() - removeTimeout).catch((err) => {
    debug('error while pruning', err)
  })
}

module.exports = async function announce (req, res) {
  await helmet.addHeaders(req, res)

  const params = req.params
  if (!validators.announce.params(params)) {
    throw validators.error(validators.announce.params.errors)
  }
  const body = await json(req)
  if (!validators.announce.body(body)) {
    throw validators.error(validators.announce.body.errors)
  }

  const publicKey = Buffer.from(params.publicKey, 'hex')
  const data = Buffer.from(body.data, 'utf8')
  const signature = Buffer.from(body.signature, 'hex')

  const serverId = publicKey.toString('hex')

  if (!verify(data, signature, publicKey)) {
    debug('invalid signature from', serverId)
    throw new Error('Invalid signature')
  }

  let object
  try {
    object = JSON.parse(data.toString('utf8'))
  } catch (err) {
    debug('invalid json from', serverId)
    err.message = `Invalid JSON: ${err.message}`
    throw err
  }

  if (!validators.announceData(object)) {
    throw validators.error(validators.announceData.errors)
  }

  await servers.update(serverId, {
    ping: Date.now(),
    data: object
  })

  debug('announce', serverId)

  prune()

  const server = await servers.get(serverId)
  send(res, 200, {
    received: server.data
  })
}
