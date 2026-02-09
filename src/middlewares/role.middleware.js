// src/middlewares/role.middleware.js
import ApiError from "../utils/ApiError.js";
import { ROLES } from "../constants/roles.js";

export const allowRoles = (...roles) => {
  return (req, _, next) => {
    if (!req.user || !req.user.role) {
      throw new ApiError(401, "Unauthorized");
    }

    const userRole = String(req.user.role).toUpperCase();

    // ✅ SUPER_ADMIN always has access (Global Bypass)
    if (userRole === "SUPER_ADMIN") {
      return next();
    }

    const allowedRoles = roles.map(r => r.toUpperCase());

    console.log("USER ROLE:", userRole);
    console.log("ALLOWED ROLES:", allowedRoles);

    if (!allowedRoles.includes(userRole)) {
      throw new ApiError(403, "Access denied");
    }

    next();
  };
};
