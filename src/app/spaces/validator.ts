const Joi = require("joi").extend(require("@joi/date"));

export const SpacesScheme = Joi.object({
  content: Joi.string().min(1).max(300).optional(),
  image: Joi.optional(),
  created_at: Joi.date(),
  userId: Joi.number(),
});

export const SpacesSchemeNoImg = Joi.object({
  content: Joi.string().min(1).max(300).optional(),
  image: Joi.optional(),
  created_at: Joi.date(),
  userId: Joi.number(),
});
