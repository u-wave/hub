# u-wave-announce

üWave server plugin that periodically announces the server's presence to the
server listing at https://hub.u-wave.net.

## Usage

```bash
npm install --save u-wave-announce
```

```js
import announce from 'u-wave-announce';

uw.use(announce({
  name: 'Your server name',
  subtitle: 'Very short description', // Up to about 30 characters.
  description: `
    Longer description about your server, perhaps with a list of rules.
    May include _markdown_, even!
  `,
  url: 'https://my-uwave-server.com',
}));
```

By default, the plugin sends announce messages to the announce server behind
https://hub.u-wave.net, namely https://announce.u-wave.net.

## Options

### `name` (required)

The server name.

### `subtitle` (required)

A short description of the server's purpose, up to about 30 characters. This
could be something like:

 - EDM and more!
 - International k-pop community

### `url` (required)

A URL to your server. Ideally this should be hosting a web client of some form.

### `description`

A long-form description of the server. The description can contain markdown,
including images and links. This can be a good place to put rules, links to
social media accounts associated with your server, and whatever else you want
visitors to know.

Indentation is stripped from this option, so template strings can be used like:

```js
announce({
  description: `
    # My Awesome Server

    We play cool stuff, and cool stuff only!
  `
});
```

### `hub`

The announce server to announce to. Uses https://announce.u-wave.net, the server
behind https://hub.u-wave.net, by default.

## License

[MIT](../LICENSE)
