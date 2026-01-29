import Joi from "joi";

export const getLogsSchema = Joi.object({
  role: Joi.string().optional(),
  module: Joi.string().optional(),
  action: Joi.string().optional(),
  limit: Joi.number().min(1).max(500).optional(),
});
