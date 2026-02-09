import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String },
  data: { type: Object }, // FULL FORM DATA
  roles: [{ type: String }], // admin, super_admin, staff
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model("Notification", notificationSchema);
