import OtpVerification from "../../models/Customer/otp.model.js";
import { sendOTPEmail } from "../../utils/mail.util.js";
import sendSMS from "../../utils/sendSMS.js";
import { generateOTP } from "../../utils/otp.util.js";

export const generateOtp = async ({ userId, type, newValue, sendTo }) => {
  const otp = generateOTP();

  // 🔥 STEP 1: Invalidate ALL previous OTPs for this user + type
  await OtpVerification.updateMany(
    { userId, type, verified: false },
    { $set: { verified: true } }
  );

  // 🔥 STEP 2: Create new OTP
  await OtpVerification.create({
    userId,
    type,
    newValue,
    otp,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 min
    verified: false,
  });

  // 🔥 STEP 3: Send OTP
  if (type === "email" || type === "password" || type === "mobile") {
    await sendOTPEmail({
      to: sendTo,
      otp,
      purpose:
        type === "email"
          ? "Email Change Verification"
          : type === "password"
          ? "Password Change Verification"
          : "Mobile Number Change Verification",
    });
  }
};




export const verifyOtp = async ({ userId, type, otp }) => {
  return await OtpVerification.findOne({
    userId,
    type,
    otp,
    verified: false,
    expiresAt: { $gt: new Date() }
  });
};
