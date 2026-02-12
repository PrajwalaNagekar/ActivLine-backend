import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      return null;
    }
    // Upload the file on Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    return response;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    return null;
  }
};


const deleteFromCloudinary = async (fileUrl) => {
  try {
    if (!fileUrl) return;

    // Extract public_id safely
    const parts = fileUrl.split("/");
    const fileName = parts[parts.length - 1];   // e.g. abc123.jpg
    const publicId = fileName.split(".")[0];     // e.g. abc123

    console.log("🗑 Deleting from Cloudinary:", publicId);

    await cloudinary.uploader.destroy(publicId, {
      resource_type: "image", // change to "raw" if deleting PDFs/docs
    });

  } catch (error) {
    console.error("Cloudinary delete error:", error.message);
  }
};

export { deleteFromCloudinary };
export { uploadOnCloudinary };
export default cloudinary;