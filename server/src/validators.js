const joi = require('joi');

exports.announceData = joi.object({
  name: joi.string().required().max(50),
  subtitle: joi.string().required().max(50),
  description: joi.string().optional().allow(null),
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
      thumbnail: joi.string().uri(),
    }).optional().allow(null),
    dj: joi.object({
      username: joi.string().max(50),
    }).optional().allow(null),
  }).optional().allow(null),
  usersCount: joi.number().min(0).allow(null),
});

exports.announce = {
  params: joi.object({
    publicKey: joi.string().hex().length(64),
  }),
  body: joi.object({
    data: joi.string(),
    signature: joi.string().hex(),
  }),
};
