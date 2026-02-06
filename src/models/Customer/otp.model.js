import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },

    type: {
      type: String,
      enum: ["email", "mobile", "password","profile"],
      required: true,
      index: true,
    },

    newValue: { type: String, required: true },

    otp: { type: String, required: true },

    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // ⏱ TTL auto-delete
    },

    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// 🔒 Ensure only ONE active OTP per user + type
otpSchema.index(
  { userId: 1, type: 1, verified: 1 },
  { partialFilterExpression: { verified: false } }
);

export default mongoose.model("OtpVerification", otpSchema);
