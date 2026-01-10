import ApiError from "../utils/ApiError.js";

export const allowRoles = (...roles) => {
  return (req, _, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, "Access denied");
    }
    next();
  };
};
