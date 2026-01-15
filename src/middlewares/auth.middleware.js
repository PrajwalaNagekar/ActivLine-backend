import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import Admin from "../models/auth/auth.model.js";
// import Customer from "../models/customer.model.js";


/**
 * 🔐 Verify JWT (NON-BREAKING, PRODUCTION SAFE)
 */
export const verifyJWT = asyncHandler(async (req, _res, next) => {
  let token;

  // 1️⃣ Extract token (cookie OR header)
  if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  } else if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.slice(7);
  }

  // 2️⃣ No token
  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (err) {
    // ❗ Keep same behavior as before
    throw new ApiError(401, "Invalid or expired access token");
  }

  // 3️⃣ Backward-compatible user attach
  req.user = {
    _id: decoded._id || decoded.id,
    role: decoded.role || decoded.type || "User",
    email: decoded.email || null,
  };

  // 4️⃣ Safety check (won't break old tokens)
  if (!req.user._id) {
    throw new ApiError(401, "Invalid token payload");
  }

  next();
});


// export const verifyJWT = asyncHandler(async (req, _res, next) => {
//   let token = null;

//   // 1️⃣ Extract token safely (NO precedence bug)
//   if (req.cookies?.accessToken) {
//     token = req.cookies.accessToken;
//   } else if (req.headers.authorization?.startsWith("Bearer ")) {
//     token = req.headers.authorization.replace("Bearer ", "");
//   }

//   // 2️⃣ No token → Unauthorized
//   if (!token) {
//     throw new ApiError(401, "Unauthorized request");
//   }

//   try {
//     // 3️⃣ Verify token
//     const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

//     /*
//       decoded contains:
//       {
//         _id,
//         role,
//         email,
//         iat,
//         exp
//       }
//     */

//     // 4️⃣ Attach authenticated user (TRUST ONLY THIS)
//     req.user = {
//       _id: decoded._id,
//       role: decoded.role,
//       email: decoded.email, // ✅ correct key
//     };

//     next();
//   } catch (error) {
//     throw new ApiError(401, "Invalid or expired access token");
//   }
// });

export const adminAuth = asyncHandler(async (req, _res, next) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  if (req.user.role !== "Admin") {
    throw new ApiError(403, "Admin access only");
  }

  next();
});

export const isSuperAdmin = asyncHandler((req, _, next) => {
    if (req.user.role !== "Admin") {
        throw new ApiError(403, "Forbidden: Super Admin only");
    }
    next();
});
