import ApiError from "../../utils/ApiError.js";
import Admin from "../../models/auth/auth.model.js";

export const logoutUser = async (userId) => {
  const user = await Admin.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  user.refreshToken = null;
  await user.save();

  return true;
};
