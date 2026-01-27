import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    customerId: {
      type: String,
      unique: true,
      index: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    mobile: {
      type: String,
      required: true,
      unique: true,
      match: /^[6-9]\d{9}$/,
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
      default: null,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["CUSTOMER"],
      default: "CUSTOMER",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    fcmToken: {
      type: String,
      default: null,
    },

    // 🔐 Password reset / OTP
    otp: {
      code: String,
      expiresAt: Date,
    },

    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true }
);

// 🔐 Hash password
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// 🔍 Compare password
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.models.Customer || mongoose.model("Customer", userSchema);
