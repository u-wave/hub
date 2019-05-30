const ms = require('ms')
const once = require('once')
const createDebug = require('debug')
const { promisify } = require('util')
const joi = require('joi')
const SSE = require('sse-writer')
const { verify } = require('sodium-signatures')
const validators = require('./validators')
const Store = process.env.FIRESTORE_PROJECT ? require('./firebase') : require('./memory')

const validate = promisify(joi.validate.bind(joi))
const debug = createDebug('u-wave-hub')

const removeTimeout = ms('1 day')

const bus = new Set()
const servers = new Store()

function onUpdate (serverId, server) {
  bus.forEach((notify) => {
    notify({ publicKey: serverId, ...server })
  })
}

async function announceP (req, res) {
  const publicKey = Buffer.from(req.params.publicKey, 'hex')
  const data = Buffer.from(req.body.data, 'utf8')
  const signature = Buffer.from(req.body.signature, 'hex')

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

  object = await validate(object, validators.announceData, {
    allowUnknown: true,
    stripUnknown: true
  })

  await servers.update(serverId, {
    ping: Date.now(),
    data: object
  })

  debug('announce', serverId)

  const server = await servers.get(serverId)
  res.json({
    received: server.data
  })
}

exports.announce = function announce (req, res, next) {
  announceP(req, res).catch(next)
}

exports.list = async function list (req, res) {
  const response = []

  for await (const [publicKey, server] of servers.list()) {
    response.push(Object.assign(
      {},
      server.data,
      { publicKey, timeSincePing: Date.now() - server.ping }
    ))
  }

  res.json({
    servers: response
  })
}

exports.events = function events (req, res) {
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

  stream.pipe(res)

  function write (event) {
    stream.event(id++, 'data', event)
  }
}

exports.prune = async function prune () {
  debug('prune')
  await servers.deleteBefore(Date.now() - removeTimeout)
}
