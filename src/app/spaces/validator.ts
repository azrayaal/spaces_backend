const Joi = require("joi").extend(require("@joi/date"));

export const SpacesScheme = Joi.object({
  content: Joi.string().min(1).max(300).required(),
  image: Joi.string().min(5).max(100),
  created_at: Joi.date(),
  userId: Joi.number(),
});

export const SpacesSchemeNoImg = Joi.object({
  content: Joi.string().min(1).max(300).required(),
  image: Joi.string(),
  created_at: Joi.date(),
  userId: Joi.number(),
});
