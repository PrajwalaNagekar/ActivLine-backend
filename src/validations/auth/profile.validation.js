// src/validations/auth/profile.validation.js
import Joi from "joi";
import ApiError from "../../utils/ApiError.js";

export const validateUpdateProfile = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).optional(),
    email: Joi.string().email().optional(),      // ✅ allowed
    password: Joi.string().min(6).optional(),    // ✅ allowed
    phone: Joi.string().optional(),
    fcmToken: Joi.string().optional(),
    role: Joi.forbidden(), // ❌ BLOCK ROLE AT VALIDATION LEVEL
  });

  const { error } = schema.validate(data);
  if (error) {
    throw new ApiError(400, error.message);
  }
};
