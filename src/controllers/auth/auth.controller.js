import { asyncHandler } from "../../utils/AsyncHandler.js";
import ApiResponse from "../../utils/ApiReponse.js";
import { validateCreateUser } from "../../validations/auth/auth.validation.js";
import * as AuthService from "../../services/auth/auth.service.js";

export const createUser = asyncHandler(async (req, res) => {
  validateCreateUser(req.body);

  const user = await AuthService.createUser(req.body);

  return res.status(201).json(
    ApiResponse.success(user, "User created successfully")
  );
});
