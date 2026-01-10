import { asyncHandler } from "../../utils/AsyncHandler.js";
import ApiResponse from "../../utils/ApiReponse.js";
import ApiError from "../../utils/ApiError.js";
import { loginUser } from "../../services/auth/login.service.js";

export const login = asyncHandler(async (req, res) => {
  const { email, password, fcmToken } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const result = await loginUser({ email, password, fcmToken });

  res.status(200).json(
    ApiResponse.success(result, "Login successful")
  );
});
