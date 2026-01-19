import { asyncHandler } from "../../../utils/AsyncHandler.js";
import ApiResponse from "../../../utils/ApiReponse.js";
import { validateCreateAdminStaff } from "../../../validations/auth/adminStaff/adminStaff.validation.js";
import * as AuthService from "../../../services/auth/adminStaff/adminStaff.service.js";

export const createAdminStaff = asyncHandler(async (req, res) => {
  validateCreateAdminStaff(req.body);

  const staff = await AuthService.createAdminStaff({
    ...req.body,
    createdBy: req.user._id, // admin id
  });

  return res.status(201).json(
    ApiResponse.success(staff, "Admin staff created successfully")
  );
});
