import mongoose from "mongoose";

const customerSessionSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    deviceId: {
      type: String,
      required: true,
    },

    refreshToken: {
      type: String,
      required: true,
    },
       fcmToken: {
      type: String,
      default: null,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    lastUsedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.models.CustomerSession ||
  mongoose.model("CustomerSession", customerSessionSchema);
