const Joi = require("joi").extend(require("@joi/date"));

export const ReplyScheme = Joi.object({
  content: Joi.string().min(1).max(300).optional(),
  image: Joi.optional(),
  created_at: Joi.date(),
  spaceId: Joi.number(),
});

export const ReplySchemeNoImg = Joi.object({
  content: Joi.string().min(1).max(300).optional(),
  image: Joi.optional(),
  created_at: Joi.date(),
  spaceId: Joi.number(),
});
