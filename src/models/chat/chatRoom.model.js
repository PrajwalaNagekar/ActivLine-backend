// src/models/chat/chatRoom.model.js
import mongoose from "mongoose";

const chatRoomSchema = new mongoose.Schema(
  {
   customer: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Customer",   // 🔥 FIX
  required: true,
},

    assignedStaff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin", // ADMIN_STAFF
      default: null,
    },

    createdByAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },

    status: {
      type: String,
      enum: ["OPEN", "ASSIGNED", "CLOSED"],
      default: "OPEN",
    },
  },
  { timestamps: true }
);

export default mongoose.model("ChatRoom", chatRoomSchema);
