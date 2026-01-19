import ApiError from "../../utils/ApiError.js";
import * as AdminRepo from "../../repositories/auth/auth.profile.repository.js";

// export const createUser = async (payload) => {
//   const exists = await AdminRepo.findByEmail(payload.email);
//   if (exists) {
//     throw new ApiError(409, "User with email already exists");
//   }

//   const user = await AdminRepo.createAuth({
//     name: payload.name,
//     email: payload.email,
//     password: payload.password,
//     role: payload.role || "ADMIN", // ✅ default role
//     phone: payload.phone || null,
//     fcmToken: payload.fcmToken || null,
//     createdBy: null,
//   });

//   return {
//     id: user._id,
//     name: user.name,
//     email: user.email,
//     role: user.role,
    
//     createdAt: user.createdAt,
//   };
// };

export const createUser = async (payload) => {
  const exists = await AdminRepo.findByEmail(payload.email);
  if (exists) {
    throw new ApiError(409, "User with email already exists");
  }

  const user = await AdminRepo.createAuth({
    name: payload.name,
    email: payload.email,
    password: payload.password,

    // 🔒 HARD LOCK ROLE
    role: "ADMIN",

    phone: payload.phone || null,
    fcmToken: payload.fcmToken || null,
    createdBy: null,
  });

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
};

