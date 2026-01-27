import mongoose from "mongoose";
import ApiError from "../../../utils/ApiError.js";

export const validateCannedResponse = (data) => {
  const { categoryId, title, message } = data;

  if (!categoryId) {
    throw new ApiError(400, "Category is required");
  }

  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    throw new ApiError(400, "Invalid category ID");
  }

  if (!title || typeof title !== "string") {
    throw new ApiError(400, "Title is required");
  }

  if (!message || typeof message !== "string") {
    throw new ApiError(400, "Message is required");
  }
};
