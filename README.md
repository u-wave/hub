# üWave Server Hub

A web app indexing available public üWave servers.

[Live Site][] - [Adding Your Server](#adding-your-server) - [License](#license)

[![Screenshot](.github/screenshot.png)][Live Site]

## Adding Your Server

If you are using the üWave Core executables or Dockerfiles, announcing is available by default.

If you are writing your own JS file to run the server, you have to manually add the `u-wave-announce` plugin:

```js
import uwave from 'u-wave-core';
import announce from 'u-wave-announce';

const uw = uwave({ /* Options. */ });

uw.use(announce);
```

The announce plugin must be configured in the admin panel.
Type `/admin` in chat in the web client, click "Server Configuration", and open the "Announce" section.

## License

[MIT][]

[MIT]: ./LICENSE

[Live Site]: https://hub.u-wave.net
