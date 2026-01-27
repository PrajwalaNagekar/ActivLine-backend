import Joi from "joi";

export const registerSchema = Joi.object({
  fullName: Joi.string().min(3).required(),
  mobile: Joi.string().pattern(/^[6-9]\d{9}$/).required(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).required(),
});

export const loginSchema = Joi.object({
  identifier: Joi.string().required(), // mobile OR customerId
  password: Joi.string().required(),
});
