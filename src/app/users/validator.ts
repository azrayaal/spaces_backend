const Joi = require("joi").extend(require("@joi/date"));

export const UserScheme = Joi.object({
  username: Joi.string().min(3).max(100).required(),
  full_name: Joi.string().min(3).max(100).required(),
  email: Joi.string().min(5).max(100).required(),
  password: Joi.string().min(5).max(100).required(),
  profile_picture: Joi.string().min(5).max(300).required(),
  profile_description: Joi.string().min(5).max(300).required(),
  created_at: Joi.date(),
});

export const UpdateUserScheme = Joi.object({
  username: Joi.string().min(3).max(100).required(),
  full_name: Joi.string().min(3).max(100).required(),
  email: Joi.string().min(5).max(100).required(),
  profile_picture: Joi.string().min(5).max(300),
  profile_description: Joi.string().min(5).max(300).required(),
  id: Joi.number(),
});
