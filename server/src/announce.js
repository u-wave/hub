const { verify } = require('sodium-signatures')
const debug = require('debug')('u-wave-hub')
const validators = require('./validators')
const { json, send } = require('micro')
const { promisify } = require('util')
const servers = require('./store')
const joi = require('joi')
const ms = require('ms')

const validate = promisify(joi.validate.bind(joi))
const validateOpts = {
  allowUnknown: true,
  stripUnknown: true
}

const removeTimeout = ms('1 day')

function prune () {
  debug('prune')
  servers.deleteBefore(Date.now() - removeTimeout).catch((err) => {
    debug('error while pruning', err)
  })
}

module.exports = async function announce (req, res) {
  const params = await validate(req.params, validators.announce.params, validateOpts)
  const body = await validate(await json(req), validators.announce.body, validateOpts)

  const publicKey = Buffer.from(req.params.publicKey, 'hex')
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

  object = await validate(object, validators.announceData, validateOpts)

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
