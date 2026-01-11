import { asyncHandler } from "../../utils/AsyncHandler.js";
import ApiResponse from "../../utils/ApiReponse.js";
import { logoutUser } from "../../services/auth/logout.service.js";

export const logout = asyncHandler(async (req, res) => {
  await logoutUser(req.user._id);

  res.status(200).json(
    ApiResponse.success(null, "Logout successful")
  );
});
