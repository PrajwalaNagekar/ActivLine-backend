import ApiError from "../../../utils/ApiError.js";

export const validateCreateAdminStaff = (data) => {
  const { name, email, password, role } = data;

  if (!name) throw new ApiError(400, "Name is required");
  if (!email) throw new ApiError(400, "Email is required");
  if (!password) throw new ApiError(400, "Password is required");

  // 🔒 STRICT ROLE CHECK
  if (role && role !== "ADMIN_STAFF") {
    throw new ApiError(403, "Only ADMIN_STAFF can be created here");
  }
};
