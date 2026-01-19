// src/middlewares/allowRoles.middleware.js
import ApiError from "../utils/ApiError.js";

export const allowRoles = (...roles) => {
  return (req, _, next) => {
    if (!req.user || !req.user.role) {
      throw new ApiError(401, "Unauthorized");
    }

    const userRole = req.user.role.toUpperCase();
    const allowedRoles = roles.map(r => r.toUpperCase());

    console.log("USER ROLE:", userRole);
    console.log("ALLOWED ROLES:", allowedRoles);

    if (!allowedRoles.includes(userRole)) {
      throw new ApiError(403, "Access denied");
    }

    next();
  };
};
