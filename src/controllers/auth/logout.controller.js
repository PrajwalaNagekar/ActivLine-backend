import { asyncHandler } from "../../utils/AsyncHandler.js";
import ApiResponse from "../../utils/ApiReponse.js";
import { logoutService } from "../../services/auth/logout.service.js";
import { validateLogout } from "../../validations/auth/logout.validator.js";

export const logout = asyncHandler(async (req, res) => {
  // validate body
  validateLogout(req.body || {});

  const { fcmToken } = req.body || {};

  // only own user (from JWT)
  await logoutService({
    userId: req.user._id,
    fcmToken,
  });

  res.status(200).json(
    ApiResponse.success(null, "Logout successful")
  );
});
