import mongoose from "mongoose";

const cannedResponseSchema = new mongoose.Schema({
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CannedCategory",
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  }
}, { timestamps: true });

export default mongoose.model("CannedResponse", cannedResponseSchema);
