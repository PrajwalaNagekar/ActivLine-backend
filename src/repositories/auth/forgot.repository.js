import Admin from "../../models/auth/auth.model.js";

export const findUserByEmail = (email) => {
  return Admin.findOne({ email });
};

export const saveOTP = (userId, otp) => {
  return Admin.findByIdAndUpdate(userId, {
    resetOTP: otp,
    resetOTPExpiry: Date.now() + 5 * 60 * 1000,
  });
};

export const findValidOTPUser = (email, otp) => {
  return Admin.findOne({
     email,
    resetOTP: otp,
    resetOTPExpiry: { $gt: Date.now() },
  });
};

export const updatePassword = async (userId, password) => {
  const user = await Admin.findById(userId);
  if (!user) return null;

  user.password = password; // ✅ triggers pre("save")
  user.resetOTP = null;
  user.resetOTPExpiry = null;

  await user.save(); // 🔥 password gets hashed
};
