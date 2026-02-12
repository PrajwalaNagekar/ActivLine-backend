// models/Notification/notification.model.js

import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    title: String,
    message: String,

    type: {
      type: String,
      enum: ["TICKET", "CHAT", "SYSTEM"],
      default: "SYSTEM",
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("CustomerNotification", notificationSchema);
