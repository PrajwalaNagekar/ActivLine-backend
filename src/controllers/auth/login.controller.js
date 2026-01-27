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

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  res
    .status(200)
    .cookie("accessToken", result.accessToken, options)
    .cookie("refreshToken", result.refreshToken, options)
    .json(ApiResponse.success(result, "Login successful"));
});
