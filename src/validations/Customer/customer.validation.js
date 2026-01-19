import Joi from "joi";

export const createCustomerSchema = Joi.object({
  fullName: Joi.string().min(3).required(),

  mobile: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .required(),

  email: Joi.string().email().optional(),

  password: Joi.string().min(6).required(),

  // ✅ role added safely
  role: Joi.string()
    .valid("CUSTOMER")
    .optional()
    .default("CUSTOMER"),
});

export const loginCustomerSchema = Joi.object({
  identifier: Joi.string().required(), // email OR mobile
  password: Joi.string().required(),
});
