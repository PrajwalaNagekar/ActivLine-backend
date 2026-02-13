
import ApiError from "../../utils/ApiError.js";
import Admin from "../../models/auth/auth.model.js";
import StaffStatus from "../../models/staff/Staff.model.js";

export const loginUser = async ({
  email,
  password,
  fcmToken,
  deviceId, // 👈 NEW (very important)
}) => {
  const user = await Admin.findOne({ email }).select("+password");
  if (!user) throw new ApiError(401, "Invalid credentials");

  // 🔐 PASSWORD CHECK
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

  // 🔔 FCM TOKEN HANDLING (MULTI-DEVICE)
  if (fcmToken && deviceId) {
    // ✅ Safety: Ensure array exists
    if (!user.fcmTokens) user.fcmTokens = [];

    const existingDevice = user.fcmTokens.find(
      (d) => d.deviceId === deviceId
    );

    if (existingDevice) {
      // 🔁 Same device → update token & timestamp
      existingDevice.token = fcmToken;
      existingDevice.lastUsedAt = new Date();
    } else {
      // ➕ New device
      user.fcmTokens.push({
        token: fcmToken,
        deviceId,
        lastUsedAt: new Date(),
      });
    }
  }

  await user.save({ validateBeforeSave: false });

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      fcmTokens: user.fcmTokens,
    },
    currentFcmToken: fcmToken,
    accessToken,
    refreshToken,
  };
};
