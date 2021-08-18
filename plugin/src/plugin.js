const fs = require('fs').promises;
const { promisify } = require('util');
const randomBytes = promisify(require('crypto').randomBytes);
const fetch = require('node-fetch');
const stripIndent = require('strip-indent');
const findCacheDir = require('find-cache-dir');
const debug = require('debug')('uwave:announce');
const sodium = require('./signatures');
const pkg = require('../package.json');

const optionsSchema = {
  type: 'object',
  title: 'Announce',
  description: 'Options for publically announcing this server. Announcing allows users to find this server on "Hubs", such as https://hub.u-wave.net.',
  'uw:key': 'u-wave:announce',
  properties: {
    enabled: {
      type: 'boolean',
      title: 'Enabled',
      description: 'Whether to announce at all.',
      default: false,
    },
    seed: {
      type: 'string',
      pattern: /^[0-9a-f]{64}$/.source,
      // Should not be edited by users.
      readOnly: true,
      // Should not be exposed to users.
      writeOnly: true,
    },
    name: {
      type: 'string',
      title: 'Server Name',
    },
    subtitle: {
      type: 'string',
      title: 'Tagline',
      description: 'A short description of the server\'s purpose, up to about 30 characters.',
      examples: [
        'EDM and more!',
        'International K-Pop Community',
      ],
    },
    description: {
      type: 'string',
      'uw:control': 'textarea',
      title: 'Description',
      description: 'A long-form description of the server. '
        + 'The description can contain Markdown, including images and links. '
        + 'This can be a good place to put rules, links to social media accounts associated '
        + 'with your server, and whatever else you want visitors to know.',
    },
    url: {
      type: 'string',
      format: 'uri',
      title: 'URL',
      description: 'A URL to your server. Ideally this should be hosting a web client of some form.',
    },
    socketUrl: {
      type: 'string',
      format: 'uri',
      title: 'WebSocket URL',
      description: 'A WebSocket endpoint URL for your server. This defaults to `url` with the ws:// or wss:// protocol, so this almost never has to be set.',
    },
    apiUrl: {
      type: 'string',
      format: 'uri',
      title: 'API URL',
      description: 'The base URL for the HTTP API your server. This defaults to `url` + /v1, so this almost never has to be set.',
    },
    hub: {
      type: 'string',
      format: 'uri',
      title: 'Hub URL',
      description: 'The announce server to announce to. Uses https://announce.u-wave.net, the server behind https://hub.u-wave.net, by default.',
      default: 'https://announce.u-wave.net',
    },
  },
  // At least one of these must match. So, if `enabled` is _not_ false, the properties are required.
  anyOf: [{
    properties: {
      enabled: { const: false },
    },
  }, {
    required: ['name', 'subtitle', 'url'],
  }],
};

function stripSlashes(url) {
  return url.replace(/\/+$/, '');
}

async function getKeyPair(seed) {
  const keyPairPath = findCacheDir({
    name: pkg.name,
    create: true,
    thunk: true,
  })('keypair.json');
  try {
    const { publicKey, secretKey, forSeed } = JSON.parse(
      await fs.readFile(keyPairPath, 'utf8'),
    );

    if (Buffer.compare(Buffer.from(forSeed), Buffer.from(seed)) !== 0) {
      throw new Error('this error object is unused');
    }

    return {
      publicKey: Buffer.from(publicKey, 'base64'),
      secretKey: Buffer.from(secretKey, 'base64'),
    };
  } catch (error) {
    const { publicKey, secretKey } = await sodium.keyPair(seed);
    await fs.writeFile(keyPairPath, JSON.stringify({
      publicKey: Buffer.from(publicKey).toString('base64'),
      secretKey: Buffer.from(secretKey).toString('base64'),
      forSeed: seed,
    }, null, 2), 'utf8');
    return { publicKey, secretKey };
  }
}

async function getAnnounceData(uw, options) {
  const url = stripSlashes(options.url);

  // TODO add something to üWave Core so we don't have to manually populate
  // the relationships.
  const entry = await uw.booth.getCurrentEntry();
  if (entry) {
    entry.populate('user media.media');
    await entry.execPopulate();
  }

  // TODO add something to üWave Core so we don't have to manually ask Redis for
  // this information. Currently üWave Core may register duplicates in this
  // list, too, which is a bit annoying!
  // TODO add guest users here too.
  const onlineUserIDs = await uw.redis.lrange('users', 0, -1);
  const onlineUsersMap = {};
  onlineUserIDs.forEach((id) => {
    onlineUsersMap[id] = true;
  });
  const usersCount = Object.keys(onlineUsersMap).length;

  return {
    name: options.name,
    subtitle: options.subtitle,
    description: options.description ? stripIndent(options.description) : null,

    booth: entry ? {
      media: {
        artist: entry.media.artist,
        title: entry.media.title,
        thumbnail: entry.media.media.thumbnail,
      },
      dj: entry.user ? {
        username: entry.user.username,
      } : null,
    } : null,

    usersCount,

    url,
    // Derive URLs if not given.
    apiUrl: options.apiUrl || `${url}/v1`,
    socketUrl: options.socketUrl || `${url.replace(/^http/, 'ws')}/`,
  };
}

async function getOrGenerateSeed(uw) {
  const options = await uw.config.get(optionsSchema['uw:key']);
  if (!options.seed) {
    options.seed = (await randomBytes(32)).toString('hex');
    await uw.config.set(optionsSchema['uw:key'], options);
  }
  return Buffer.from(options.seed, 'hex');
}

async function announcePlugin(uw, staticOptions) {
  uw.config.register(optionsSchema['uw:key'], optionsSchema);

  const seed = staticOptions.seed || await getOrGenerateSeed(uw);
  const { publicKey, secretKey } = await getKeyPair(seed);

  async function announce() {
    const options = await uw.config.get(optionsSchema['uw:key']);
    if (typeof options !== 'object') {
      debug('announcing not configured, skipping');
      return;
    }
    if (!options.enabled) {
      debug('announcing disabled, skipping');
      return;
    }

    const hubHost = options.hub || 'https://announce.u-wave.net';
    const announceUrl = `${stripSlashes(hubHost)}/announce/${Buffer.from(publicKey).toString('hex')}`;
    debug('announcing to', announceUrl);

    const announcement = await getAnnounceData(uw, options);
    const data = JSON.stringify(announcement);
    const signature = await sodium.sign(Buffer.from(data, 'utf8'), secretKey);

    await fetch(announceUrl, {
      method: 'post',
      headers: {
        'user-agent': `u-wave-announce ${pkg.version}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        data,
        signature: Buffer.from(signature).toString('hex'),
      }),
    });
  }

  function onError(err) {
    debug(err);
  }

  let interval;

  uw.ready().then(() => {
    // Announce that we've started up and are now alive.
    announce().catch(onError);

    // And announce periodically in the mean time to let the Hub server know
    // we're still alive.
    interval = setInterval(() => {
      announce().catch(onError);
    }, 60_000);
  });

  // Announce again every time the song changes.
  uw.on('advance', () => {
    announce().catch(onError);
  });

  uw.onClose(() => {
    clearInterval(interval);
  });
}

module.exports = announcePlugin;
