// src/validations/chat/chat.validation.js
import Joi from "joi";

export const assignStaffSchema = Joi.object({
  roomId: Joi.string().required(),
  staffId: Joi.string().required(),
});
