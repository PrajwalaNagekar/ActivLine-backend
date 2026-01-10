import ApiError from "../../utils/ApiError.js";

export const validateCreateUser = (data) => {
  const { name, email, password, fcmToken } = data;

  if (!name) throw new ApiError(400, "Name is required");
  if (!email) throw new ApiError(400, "Email is required");
  if (!password) throw new ApiError(400, "Password is required");

  // ❌ NO role validation here

  if (fcmToken && typeof fcmToken !== "string") {
    throw new ApiError(400, "Invalid FCM token");
  }
};
