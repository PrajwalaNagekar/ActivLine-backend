import { asyncHandler } from "../../utils/AsyncHandler.js";
import ApiResponse from "../../utils/ApiReponse.js";
import {
  forgotPasswordService,
  resetPasswordService,
} from "../../services/auth/forgot.service.js";

import {
  validateForgotPassword,
  validateResetPassword,
} from "../../validations/auth/forgot.validator.js";
import ApiError from "../../utils/ApiError.js";

export const forgotPassword = asyncHandler(async (req, res) => {
  // ✅ VALIDATE INPUT
  validateForgotPassword(req.body);

  const { email } = req.body;
  if (email !== req.user.email) {
    throw new ApiError(403, "You can change only your own password");
  }

  await forgotPasswordService(email);

  res.status(200).json(
    ApiResponse.success(null, "OTP sent to email")
  );
});

export const resetPassword = asyncHandler(async (req, res) => {
  // ✅ VALIDATE INPUT
  validateResetPassword(req.body);

  const { email, otp, password } = req.body;
  if (email !== req.user.email) {
    throw new ApiError(403, "You can change only your own password");
  }

  await resetPasswordService({ email, otp, password });

  res.status(200).json(
    ApiResponse.success(null, "Password reset successful")
  );
});
