import { asyncHandler } from "../../utils/AsyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { getActivlineUserDetails ,updateUserInActivline} from "../../services/customer/customerprofile.service.js";

import { generateOtp, verifyOtp } from "../../services/customer/otp.service.js";

export const editUserProfile = asyncHandler(async (req, res) => {
  const { userId, email, phoneNumber, password, ...others } = req.body;

  if (!userId) throw new ApiError(400, "userId required");

  const current = await getActivlineUserDetails(userId);
  const user = current?.[0]?.User;

  if (!user) throw new ApiError(404, `User with ID ${userId} not found`);

  const emailChanged = email && email !== user.email;
  const phoneChanged = phoneNumber && phoneNumber !== user.phone;
  const passwordChanged = !!password;

  // ❌ allow only ONE sensitive change
  const sensitiveChanges = [emailChanged, phoneChanged, passwordChanged].filter(Boolean).length;
  if (sensitiveChanges > 1) {
    throw new ApiError(
      400,
      "Please change only one of email, mobile, or password at a time."
    );
  }

  // 🔐 EMAIL CHANGE → OTP to OLD email
  if (emailChanged) {
    await generateOtp({
      userId,
      type: "email",
      newValue: email,     // NEW email (to update after verify)
      sendTo: user.email   // OLD email (verified)
    });

    return res.status(200).json({
      success: true,
      message: "OTP sent to your registered email address for verification."
    });
  }

  // 🔐 MOBILE CHANGE → OTP to OLD mobile
  if (phoneChanged) {
    if (!user.email) {
      throw new ApiError(400, "Registered email is required to verify mobile number change.");
    }

    await generateOtp({
      userId,
      type: "mobile",
      newValue: phoneNumber, // NEW mobile
      sendTo: user.email     // Send OTP to EMAIL instead of mobile
    });

    return res.status(200).json({
      success: true,
      message: "OTP sent to your registered email for mobile number verification."
    });
  }

  // 🔐 PASSWORD CHANGE → OTP to OLD email
  if (passwordChanged) {
    if (!user.email) {
      throw new ApiError(
        400,
        "Cannot change password without a verified email on file."
      );
    }

    await generateOtp({
      userId,
      type: "password",
      newValue: password, // NEW password (apply after verify)
      sendTo: user.email  // OLD email
    });

    return res.status(200).json({
      success: true,
      message: "OTP sent to your registered email to confirm password change."
    });
  }

  // ✅ NON-SENSITIVE UPDATE (no OTP)
  if (Object.keys(others).length > 0) {
    await updateUserInActivline({ userId, ...others });
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully"
    });
  }

  return res.status(200).json({
    success: true,
    message: "No changes detected for sensitive fields."
  });
});



export const verifyOtpAndUpdate = asyncHandler(async (req, res) => {
  const { userId, type, otp, newValue } = req.body;

  if (!userId || !type || !otp) {
      throw new ApiError(400, "userId, type, and otp are required.");
  }
  if (type === 'password' && !newValue) {
      throw new ApiError(400, "newValue (the new password) is required for password updates.");
  }

  const record = await verifyOtp({ userId, type, otp });
  if (!record) throw new ApiError(400, "Invalid or expired OTP");

  let payload;
  let successMessage;

  switch (type) {
    case "email":
      payload = { userId, emailId: record.newValue };
      successMessage = "Email updated successfully";
      break;
    case "mobile":
      payload = { userId, phoneNumber: record.newValue };
      successMessage = "Mobile updated successfully";
      break;
    case "password":
      payload = { userId, password: newValue };
      successMessage = "Password updated successfully";
      break;
    default:
      throw new ApiError(400, "Invalid update type");
  }

  await updateUserInActivline(payload);

  record.verified = true;
  await record.save();

  res.json({ success: true, message: successMessage });
});
