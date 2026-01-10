import ApiError from "../../utils/ApiError.js";
import Admin from "../../models/auth/auth.model.js";

export const loginUser = async ({ email, password, fcmToken }) => {
  const user = await Admin.findOne({ email }).select("+password");

  if (!user) throw new ApiError(401, "Invalid credentials");

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new ApiError(401, "Invalid credentials");

  const accessToken = user.generateAccessToken(); // 🔥 role inside JWT
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  if (fcmToken) user.fcmToken = fcmToken;

  await user.save({ validateBeforeSave: false });

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role, // 🔥 role returned
    },
    accessToken,
    refreshToken,
  };
};


