# üWave Announce Server

This is a small HTTP API service that keeps track of alive üWave servers.
A public instance is available at https://announce.u-wave.net.

## Endpoints

### `GET /` - List available servers

Responds with a JSON object with a `servers` property.
This `servers` property contains an array of server objects.

A server object looks like:

 - `publicKey` - The server's ID and public key.
 - `name` - The human-readable name of the server.
 - `subtitle` - A (very) short description of what the server is for. About 30 characters max.
 - `description` - A longer description about the server, with Markdown. Server hosts may choose to put rules etc in here.
 - `booth` - The current booth state. May be `null` if no song is playing, or an object with:
   - `media` - An object describing the song that's being played.
     - `artist` - The song artist.
     - `title` - The song title.
     - `thumbnail` - A URL to a thumbnail image for this song.
   - `dj` - An object describing the user playing the song.
     - `username` - The user's name.
 - `usersCount` - The amount of users that are currently online.
 - `url` - A URL to a hosted web application for the server.
 - `apiUrl` - The base URL for the server's HTTP API endpoint.
 - `socketUrl` - The URL to the server's WebSocket API endpoint.
 - `timeSincePing` - Time in milliseconds since the last time the server announced itself.

### `POST /announce/:publicKey` - Announce your server

Send a JSON object in the body to announce information about your server.
The `publicKey` URL parameter is a sodium public key and is used to verify that announces for a server aren't made up by someone else.
The JSON body of the request should be signed using your server's private key.

## License

[MIT](../LICENSE)

