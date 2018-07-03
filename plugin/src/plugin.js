import fs from 'fs'
import got from 'got'
import ms from 'ms'
import stripIndent from 'strip-indent'
import findCacheDir from 'find-cache-dir'
import createDebug from 'debug'
import * as sodium from './signatures'
import { name as pkgName } from '../package.json'

const debug = createDebug('uwave:announce')

const optionsSchema = {
  type: 'object',
  properties: {
    enabled: {
      type: 'boolean',
      description: 'Whether to announce at all.',
      default: true
    },
    name: {
      type: 'string',
      description: 'The server name.'
    },
    subtitle: {
      type: 'string',
      description: 'A short description of the server\'s purpose, up to about 30 characters.',
      examples: [
        'EDM and more!',
        'International K-Pop Community'
      ]
    },
    description: {
      type: 'string',
      description: 'A long-form description of the server. '
        + 'The description can contain markdown, including images and links. '
        + 'This can be a good place to put rules, links to social media accounts associated '
        + 'with your server, and whatever else you want visitors to know.'
    },
    url: {
      type: 'string',
      format: 'uri',
      description: 'A URL to your server. Ideally this should be hosting a web client of some form.'
    },
    socketUrl: {
      type: 'string',
      format: 'uri',
      description: 'A WebSocket endpoint URL for your server. This defaults to `url` with the ws:// or wss:// protocol, so this almost never has to be set.'
    },
    apiUrl: {
      type: 'string',
      format: 'uri',
      description: 'The base URL for the HTTP API your server. This defaults to `url` + /v1, so this almost never has to be set.'
    },
    hub: {
      type: 'string',
      format: 'uri',
      description: 'The announce server to announce to. Uses https://announce.u-wave.net, the server behind https://hub.u-wave.net, by default.',
      default: 'https://announce.u-wave.net'
    }
  },
  required: ['enabled', 'name', 'subtitle', 'url']
}

function stripSlashes (url) {
  return url.replace(/\/+$/, '')
}

function getKeyPair (seed) {
  const keyPairPath = findCacheDir({
    name: pkgName,
    create: true,
    thunk: true
  })('keypair.json')
  try {
    const { publicKey, secretKey } = JSON.parse(
      fs.readFileSync(keyPairPath, 'utf8')
    )
    return {
      publicKey: Buffer.from(publicKey, 'base64'),
      secretKey: Buffer.from(secretKey, 'base64')
    }
  } catch (err) {
    const { publicKey, secretKey } = sodium.keyPair(seed)
    fs.writeFileSync(keyPairPath, JSON.stringify({
      publicKey: publicKey.toString('base64'),
      secretKey: secretKey.toString('base64')
    }, null, 2), 'utf8')
    return { publicKey, secretKey }
  }
}

async function getAnnounceData (uw, options) {
  const url = stripSlashes(options.url)

  // TODO add something to üWave Core so we don't have to manually populate
  // the relationships.
  const entry = await uw.booth.getCurrentEntry()
  if (entry) {
    entry.populate('user media.media')
    await entry.execPopulate()
  }

  // TODO add something to üWave Core so we don't have to manually ask Redis for
  // this information. Currently üWave Core may register duplicates in this
  // list, too, which is a bit annoying!
  // TODO add guest users here too.
  const onlineUserIDs = await uw.redis.lrange('users', 0, -1)
  const onlineUsersMap = {}
  onlineUserIDs.forEach((id) => {
    onlineUsersMap[id] = true
  })
  const usersCount = Object.keys(onlineUsersMap).length

  return {
    name: options.name,
    subtitle: options.subtitle,
    description: options.description ? stripIndent(options.description) : null,

    booth: entry ? {
      media: {
        artist: entry.media.artist,
        title: entry.media.title,
        thumbnail: entry.media.media.thumbnail
      },
      dj: entry.user ? {
        username: entry.user.username
      } : null
    } : null,

    usersCount,

    url,
    // Derive URLs if not given.
    apiUrl: options.apiUrl || `${url}/v1`,
    socketUrl: options.socketUrl || `${url.replace(/^http/, 'ws')}/`
  }
}

export default function announcePlugin (options) {
  const { publicKey, secretKey } = getKeyPair(options.seed)

  return (uw) => {
    uw.config.register('announce', optionsSchema);

    async function announce () {
      const options = await uw.config.get('announce')
      if (typeof options !== 'object') {
        debug('announcing not configured, skipping')
        return
      }
      if (!options.enabled) {
        debug('announcing disabled, skipping')
        return
      }

      const hubHost = options.hub || 'https://announce.u-wave.net'
      const announceUrl = `${stripSlashes(hubHost)}/announce/${publicKey.toString('hex')}`
      debug('announcing to', announceUrl)

      const announcement = await getAnnounceData(uw, options)
      const data = JSON.stringify(announcement)
      const signature = sodium.sign(Buffer.from(data, 'utf8'), secretKey).toString('hex')

      await got.post(announceUrl, {
        json: true,
        body: { data, signature }
      })
    }

    function onError (err) {
      debug(err)
    }

    // Announce that we've started up and are now alive.
    announce().catch(onError)

    // Announce again every time the song changes.
    uw.on('advance', () => {
      announce().catch(onError)
    })

    // And announce periodically in the mean time to let the Hub server know
    // we're still alive.
    const interval = setInterval(() => {
      announce().catch(onError)
    }, ms('1 minute'))
    uw.on('stop', () => {
      clearInterval(interval)
    })
  }
}
