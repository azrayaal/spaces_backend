const Joi = require("joi").extend(require("@joi/date"));

export const UserScheme = Joi.object({
  username: Joi.string().min(3).max(100).required(),
  full_name: Joi.string().min(3).max(100).required(),
  email: Joi.string().min(5).max(100).required(),
  password: Joi.string().min(5).max(100).required(),
  profile_picture: Joi.string().optional(),
  profile_description: Joi.string().min(5).max(300).required(),
  created_at: Joi.date(),
});

export const UpdateUserScheme = Joi.object({
  username: Joi.string().min(3).max(100).optional(),
  full_name: Joi.string().min(3).max(100).optional(),
  email: Joi.string().min(5).max(100).optional(),
  profile_picture: Joi.string().optional(),
  header: Joi.string().optional(),
  profile_description: Joi.string().min(5).max(300).optional(),
  id: Joi.number(),
});
