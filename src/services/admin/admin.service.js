// import ApiError from "../../utils/ApiError.js";
// import * as AdminRepo from "../../repositories/admin/admin.management.repository.js";

// export const createAdminUser = async (payload, creator = null) => {
//   if (creator && creator.role !== "ADMIN") {
//     throw new ApiError(403, "Only ADMIN can create admin users");
//   }

//   const exists = await AdminRepo.findAdminByEmail(payload.email);
//   if (exists) {
//     throw new ApiError(409, "Admin with email already exists");
//   }

//   const admin = await AdminRepo.createAdmin({
//     name: payload.name,
//     email: payload.email,
//     password: payload.password,
//     role: payload.role || "ADMIN",
//     fcmToken: payload.fcmToken || null,
//     createdBy: creator?._id || null,
//   });

//   return {
//     id: admin._id,
//     name: admin.name,
//     email: admin.email,
//     role: admin.role,
//     createdAt: admin.createdAt,
//   };
// };
