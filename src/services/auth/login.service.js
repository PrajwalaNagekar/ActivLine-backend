// import ApiError from "../../utils/ApiError.js";
// import Admin from "../../models/auth/auth.model.js";
// import StaffStatus from "../../models/staff/Staff.model.js";



// export const loginUser = async ({ email, password, fcmToken }) => {
//   const user = await Admin.findOne({ email }).select("+password");

//   if (!user) throw new ApiError(401, "Invalid credentials");

//   if (user.role === "ADMIN_STAFF") {
//     const staffStatus = await StaffStatus.findOne({ staffId: user._id });
//     if (staffStatus && (staffStatus.status === "TERMINATED" || staffStatus.status === "DISABLED")) {
//       throw new ApiError(403, "Your account has been " + staffStatus.status.toLowerCase());
//     }
//   }

//   const isMatch = await user.comparePassword(password);
//   if (!isMatch) throw new ApiError(401, "Invalid credentials");

//   const accessToken = user.generateAccessToken(); // 🔥 role inside JWT
//   const refreshToken = user.generateRefreshToken();

//   user.refreshToken = refreshToken;
//   if (fcmToken) user.fcmToken = fcmToken;

//   await user.save({ validateBeforeSave: false });

//   return {
//     user: {
//       id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role, // 🔥 role returned
//     },
//     accessToken,
//     refreshToken,
//   };
// };


import ApiError from "../../utils/ApiError.js";
import Admin from "../../models/auth/auth.model.js";
import StaffStatus from "../../models/staff/Staff.model.js";

export const loginUser = async ({ email, password, fcmToken }) => {
  const user = await Admin.findOne({ email }).select("+password");
  if (!user) throw new ApiError(401, "Invalid credentials");

  // 🔐 PASSWORD CHECK FIRST
  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new ApiError(401, "Invalid credentials");

  // 🔐 STAFF STATUS CHECK
  if (user.role === "ADMIN_STAFF") {
    const staffStatus = await StaffStatus.findOne({ staffId: user._id });

    if (!staffStatus) {
      throw new ApiError(403, "Staff status not found");
    }

    if (staffStatus.status === "TERMINATED") {
      throw new ApiError(403, "Your account is terminated. Contact admin.");
    }

    if (staffStatus.status === "INACTIVE") {
      throw new ApiError(403, "Your account is inactive. Ask admin to activate.");
    }

    // ✅ LOGIN SUCCESS → SET ACTIVE
    await StaffStatus.updateOne(
      { staffId: user._id },
      { status: "ACTIVE" }
    );
  }

  // 🔑 TOKEN GENERATION
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  if (fcmToken) user.fcmToken = fcmToken;

  await user.save({ validateBeforeSave: false });

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
};
