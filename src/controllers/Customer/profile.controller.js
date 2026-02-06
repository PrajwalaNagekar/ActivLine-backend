import { asyncHandler } from "../../utils/AsyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { getActivlineUserDetails ,updateUserInActivline} from "../../services/customer/customerprofile.service.js";

import { generateOtp, verifyOtp } from "../../services/customer/otp.service.js";
export const editUserProfile = asyncHandler(async (req, res) => {
  const { userId, email, phoneNumber } = req.body;

  if (!userId) {
    throw new ApiError(400, "userId is required");
  }

  let user;

  // 🔐 SAFE Activline Call (401 protected)
  try {
    const current = await getActivlineUserDetails(userId);
    user = current?.[0]?.User;
  } catch (err) {
    console.error("❌ Activline get_details failed:", err.message);
    // Forward the status code from the external API if available, otherwise default to 502 Bad Gateway
    const statusCode = err.response?.status || 502;
    const message = err.response?.data?.message || `Unable to fetch user from Activline: ${err.message}`;
    throw new ApiError(statusCode, message, err.response?.data);
  }

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // 🔍 Detect actual changes
  const updates = {};

  if (email && email !== user.email) {
    updates.email = email;
  }

  if (phoneNumber && phoneNumber !== user.phone) {
    updates.phoneNumber = phoneNumber;
  }

  // ❌ Nothing changed
  if (Object.keys(updates).length === 0) {
    return res.json({
      success: true,
      message: "No changes detected"
    });
  }

  // 🔐 Send OTP to OLD registered details
  await generateOtp({
    userId,
    type: "profile",
    newValue: JSON.stringify(updates),
    sendTo: {
      email: user.email || null,
      phone: user.phone || null
    }
  });

  return res.json({
    success: true,
    message: "OTP sent to your registered email and mobile number"
  });
});








export const verifyOtpAndUpdate = asyncHandler(async (req, res) => {
  const { userId, otp } = req.body;

  const record = await verifyOtp({
    userId,
    type: "profile",
    otp
  });

  if (!record) throw new ApiError(400, "Invalid or expired OTP");

  const updates = JSON.parse(record.newValue);

  const payload = { userId };

  if (updates.email) payload.emailId = updates.email;
  if (updates.phoneNumber) payload.phoneNumber = updates.phoneNumber;

  await updateUserInActivline(payload);

  record.verified = true;
  await record.save();

  res.json({
    success: true,
    message: "Profile updated successfully"
  });
});
