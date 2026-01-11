import ApiError from "../../utils/ApiError.js";
import { generateOTP } from "../../utils/otp.util.js";
import * as ForgotRepo from "../../repositories/auth/forgot.repository.js";

/**
 * SEND OTP
 */
export const forgotPasswordService = async (email) => {
  const user = await ForgotRepo.findUserByEmail(email);
  if (!user) {
    // 🔒 Do NOT reveal user existence in real systems (optional)
    throw new ApiError(404, "Email not registered");
  }

  // 🔐 Prevent OTP spam (cooldown 1 min)
  if (user.resetOTPExpiry && user.resetOTPExpiry > Date.now() - 60 * 1000) {
    throw new ApiError(429, "OTP already sent. Please wait before retrying");
  }

  const otp = generateOTP();

  await ForgotRepo.saveOTP(user._id, String(otp));

  // 📧 TODO: integrate nodemailer
  console.log(`OTP for ${email} is ${otp}`);
};


/**
 * RESET PASSWORD USING OTP
 */
export const resetPasswordService = async ({ email, otp, password }) => {
  const user = await ForgotRepo.findValidOTPUser(email, String(otp));
  if (!user) {
    throw new ApiError(400, "Invalid or expired OTP");
  }

  // 🔐 Update password & clear OTP atomically
  await ForgotRepo.updatePassword(user._id, password);
};
