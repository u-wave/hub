import joi from 'joi';

export const announce = {
  body: joi.object({
    name: joi.string().required().max(50),
    description: joi.string().required().max(50),
    url: joi.string().required().uri({
      scheme: ['http', 'https'],
    }),
    apiUrl: joi.string().required().uri({
      scheme: ['http', 'https'],
    }),
    socketUrl: joi.string().required().uri({
      scheme: ['ws', 'wss'],
    }),
    booth: joi.object({
      media: joi.object({
        artist: joi.string(),
        title: joi.string(),
        media: joi.object({
          thumbnail: joi.string(),
        }),
      }),
    }).optional().allow(null),
  }),
};
