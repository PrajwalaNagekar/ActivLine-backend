import ApiError from "../../../utils/ApiError.js";

export const validateCreateAdminStaff = (data) => {
  const { name, email, password, role } = data;

  if (!name) throw new ApiError(400, "Name is required");
  if (!email) throw new ApiError(400, "Email is required");
  if (!password) throw new ApiError(400, "Password is required");

  // 🔒 ALLOWED ROLES ONLY
  const ALLOWED_ROLES = ["ADMIN", "ADMIN_STAFF"];

  if (!role || !ALLOWED_ROLES.includes(role)) {
    throw new ApiError(
      403,
      "Role must be ADMIN or ADMIN_STAFF"
    );
  }
};

