# u-wave-announce

üWave server plugin that periodically announces the server's presence to the
server listing at https://hub.u-wave.net.

## Usage

The announce plugin is added by default if you use the executable provided
with üWave Core. If you are using the üWave Core Node.js API, install and
add it manually:

```bash
npm install u-wave-announce
```

```js
import announce from 'u-wave-announce';

uw.use(announce);
```

## Runtime Options
This plugin can be configured at runtime using the admin panel.

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

### `hub`

The announce server to announce to. Uses https://announce.u-wave.net, the server
behind https://hub.u-wave.net, by default.

## License

[MIT](../LICENSE)
