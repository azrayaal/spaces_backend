const Joi = require("joi").extend(require("@joi/date"));

export const SpacesScheme = Joi.object({
  content: Joi.string().min(1).max(300).required(),
  image: Joi.string().min(5).max(100).required(),
  created_at: Joi.date(),
});
