import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import Admin from "../models/auth/auth.model.js";
// import Customer from "../models/customer.model.js";

export const verifyJWT = asyncHandler((req, _, next) => {
   const token =
    req.cookies?.accessToken ||
    req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.replace("Bearer ", "")
      : null;

    // ❌ No token → Unauthorized
    if (!token) {
        throw new ApiError(401, "Unauthorized request");
    }

    try {
        // ✅ Verify token
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        /*
          decoded contains:
          {
            _id,
            role,
            iat,
            exp
          }
        */

        // ✅ Attach user identity to request
          req.user = {
      _id: decoded._id,
      role: decoded.role,
    };

        next();
    } catch (error) {
        throw new ApiError(401, "Invalid or expired access token");
    }
});

export const isSuperAdmin = asyncHandler((req, _, next) => {
    if (req.user.role !== "Admin") {
        throw new ApiError(403, "Forbidden: Super Admin only");
    }
    next();
});
