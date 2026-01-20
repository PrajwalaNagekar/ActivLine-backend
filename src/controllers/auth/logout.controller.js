import { asyncHandler } from "../../utils/AsyncHandler.js";
import ApiResponse from "../../utils/ApiReponse.js";
import { logoutService } from "../../services/auth/logout.service.js";
import { validateLogout } from "../../validations/auth/logout.validator.js";

export const logout = asyncHandler(async (req, res) => {
  validateLogout(req.body || {});

  const { fcmToken } = req.body || {};

  await logoutService({
    user: req.user,   // 🔥 PASS FULL USER
    fcmToken,
  });

  return res.status(200).json(
    ApiResponse.success(null, "Logout successful")
  );
});

