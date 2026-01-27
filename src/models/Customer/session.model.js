import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    activlineUserId: { type: String, required: true },
    accountId: { type: String, required: true },

    sessionId: { type: String, required: true }, // device id
    refreshToken: { type: String, required: true },

    deviceInfo: { type: String }, // optional
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Session", sessionSchema);
