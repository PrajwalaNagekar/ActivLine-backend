import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
      refPath: "actorModel",
    },
    actorModel: {
      type: String,
      required: true,
      enum: ["SUPER_ADMIN","Admin", "ADMIN_STAFF", "Customer", "Staff"],
    },
    actorRole: {
      type: String,
      required: true,
      enum: ["SUPER_ADMIN", "ADMIN", "ADMIN_STAFF", "STAFF", "CUSTOMER"],
      index: true,
    },
    actorName: String,

    action: {
      type: String,
      required: true, // CREATE, UPDATE, DELETE, LOGIN, VIEW
      index: true,
    },

    module: {
      type: String,
      required: true, // CHAT, TICKET, DASHBOARD, AUTH
      index: true,
    },

    description: String,

    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    metadata: {
      type: Object,
      default: {},
    },

    ipAddress: String,
    userAgent: String,
  },
  { timestamps: true }
);

export default mongoose.model("ActivityLog", activityLogSchema);
