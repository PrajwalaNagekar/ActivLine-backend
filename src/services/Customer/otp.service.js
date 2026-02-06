import OtpVerification from "../../models/Customer/otp.model.js";
import { sendOTPEmail } from "../../utils/mail.util.js";
import sendSMS from "../../utils/sendSMS.js";
import { generateOTP } from "../../utils/otp.util.js";

export const generateOtp = async ({ userId, type, newValue, sendTo }) => {
  const otp = generateOTP();

  // 🔥 Invalidate old OTPs
  await OtpVerification.updateMany(
    { userId, type, verified: false },
    { $set: { verified: true } }
  );

  // 🔐 Save OTP
  await OtpVerification.create({
    userId,
    type,
    newValue,
    otp,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
  });

  // 📧 Send OTP to OLD EMAIL (if exists)
  if (sendTo?.email) {
    try {
      await sendOTPEmail({
        to: sendTo.email,
        otp,
        purpose: "Profile Update Verification",
      });
    } catch (error) {
      console.error("⚠️ Failed to send OTP Email:", error.message);
    }
  }

  // 📱 Send OTP to OLD MOBILE (if exists)
  if (sendTo?.phone) {
    try {
      const message = `Your OTP for profile update is ${otp}. Valid for 5 minutes.`;
      await sendSMS(sendTo.phone, message);
    } catch (error) {
      console.error("⚠️ Failed to send OTP SMS:", error.message);
    }
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
