import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { verifyResetToken } from "../utils/jwt.js";

export const verifyResetJWT = asyncHandler(async (req, _, next) => {
  const token =
    req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Reset token required");
  }

  const decoded = verifyResetToken(token);

  if (decoded.purpose !== "PASSWORD_RESET") {
    throw new ApiError(403, "Invalid reset token");
  }

  req.resetUser = {
    userId: decoded.userId,
    session: decoded.session,
  };

  next();
});
