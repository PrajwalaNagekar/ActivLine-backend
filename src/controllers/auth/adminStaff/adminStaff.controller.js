import { asyncHandler } from "../../../utils/AsyncHandler.js";
import ApiResponse from "../../../utils/ApiReponse.js";
import { validateCreateAdminStaff } from "../../../validations/auth/adminStaff/adminStaff.validation.js";
import * as AuthService from "../../../services/auth/adminStaff/adminStaff.service.js";

export const createAdminStaff = asyncHandler(async (req, res) => {
  validateCreateAdminStaff(req.body);

  // 🔐 Only ADMIN can create users
  if (req.user.role !== "ADMIN") {
    throw new ApiError(403, "Only ADMIN can create users");
  }

  const staff = await AuthService.createAdminStaff({
    ...req.body,           // role comes from payload
    createdBy: req.user._id,
  });

  return res.status(201).json(
    ApiResponse.success(staff, `${staff.role} created successfully`)
  );
});

