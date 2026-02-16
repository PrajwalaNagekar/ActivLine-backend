import ApiError from "../../utils/ApiError.js";


export const validateCreateUser = (data) => {
  const { name, email, password, fcmToken, role } = data;

  if (!name) throw new ApiError(400, "Name is required");
  if (!email) throw new ApiError(400, "Email is required");
  if (!password) throw new ApiError(400, "Password is required");

  // 🔒 Allow ADMIN, SUPER_ADMIN, and ADMIN_STAFF
  if (role && role !== "ADMIN" && role !== "SUPER_ADMIN" && role !== "ADMIN_STAFF") {
    throw new ApiError(403, "Invalid role");
  }

  if (fcmToken && typeof fcmToken !== "string") {
    throw new ApiError(400, "Invalid FCM token");
  }
};
