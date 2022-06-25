import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({
  removeAdditional: true,
  useDefaults: true,
  coerceTypes: true,
});
addFormats(ajv);

export const error = (errors) => new Error(ajv.errorsText(errors));

export const announceData = {
  $id: 'https://ns.u-wave.net/schemas/AnnounceData.json',
  type: 'object',
  properties: {
    name: {
      description: 'Name of the server',
      type: 'string',
      maxLength: 50,
      examples: [
        'WLK',
        'Fake EDM',
      ],
    },
    subtitle: {
      description: 'A (very) short description of what the server is about',
      type: 'string',
      maxLength: 50,
      examples: [
        'International Korean music community',
        'Fake server for the screenshot',
      ],
    },
    description: {
      description: 'A longer description about the server, may be markdown',
      type: 'string',
    },
    url: {
      description: 'A URL to a hosted web application for the server',
      type: 'string',
      format: 'uri',
      examples: [
        'https://wlk.yt',
        'https://demo.u-wave.net',
      ],
    },
    apiUrl: {
      description: 'The base URL for the server\'s HTTP API',
      type: 'string',
      format: 'uri',
      examples: [
        'https://wlk.yt/api',
        'https://demo.u-wave.net/api',
      ],
    },
    socketUrl: {
      description: 'The base URL for the server\'s WebSocket API',
      type: 'string',
      format: 'uri',
      examples: [
        'wss://wlk.yt',
        'wss://demo.u-wave.net',
      ],
    },
    booth: {
      description: 'The current booth state, or null if no media is being played',
      type: 'object',
      nullable: true,
      properties: {
        media: {
          description: 'An object describing the media that\'s being played',
          type: 'object',
          properties: {
            artist: { description: 'The media artist or author', type: 'string' },
            title: { description: 'The media title', type: 'string' },
            thumbnail: { description: 'A URL to a thumbnail image for this media', type: 'string', format: 'uri' },
          },
          required: ['artist', 'title'],
        },
        dj: {
          description: 'An object describing the user playing the media',
          type: 'object',
          properties: {
            username: {
              description: 'The user\'s name',
              type: 'string',
            },
          },
          required: ['username'],
        },
      },
    },
    usersCount: {
      description: 'The amount of users that are currently online',
      type: 'number',
      minimum: 0,
    },
  },
  required: ['name', 'subtitle', 'url', 'apiUrl', 'socketUrl'],
};
