// import ApiError from "../../utils/ApiError.js";

// export const validateCreateAuth = (data) => {
//   const { name, email, password, role, fcmToken } = data;

//   if (!name) throw new ApiError(400, "Name is required");
//   if (!email) throw new ApiError(400, "Email is required");
//   if (!password) throw new ApiError(400, "Password is required");

//   const allowedRoles = ["ADMIN", "FRANCHISE", "ADMIN_STAFF"];
//   if (!allowedRoles.includes(role)) {
//     throw new ApiError(400, "Invalid admin role");
//   }
//    if (fcmToken && typeof fcmToken !== "string") {
//     throw new ApiError(400, "Invalid FCM token");
//   }
// };
