import Joi from "joi";

export const newConnectionSchema = Joi.object({
  fullName: Joi.string().min(3).required(),
  mobile: Joi.string().pattern(/^[6-9]\d{9}$/).required(),
  email: Joi.string().email().optional(),
  installationAddress: Joi.string().min(10).required(),
  location: Joi.object({
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
  }).required(),
});
