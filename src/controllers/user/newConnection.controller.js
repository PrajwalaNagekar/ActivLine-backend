import { asyncHandler } from "../../utils/AsyncHandler.js";
import ApiResponse from "../../utils/ApiReponse.js";
import service from "../../services/user/newConnection.service.js";
import { newConnectionSchema } from "../../validations/user/newConnection.validation.js";

export const createNewConnection = asyncHandler(async (req, res) => {
  const { error } = newConnectionSchema.validate(req.body);
  if (error) throw error;

  const lead = await service.createLead(req.body);

  res.status(201).json(
    ApiResponse.success(
      lead,
      "New connection request submitted successfully"
    )
  );
});
