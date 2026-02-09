// utils/cloudinaryUpload.js
import cloudinary from "./cloudinary.js";
import { Readable } from "stream";

export const uploadToCloudinary = ({ buffer, mimetype, originalname }) => {
  return new Promise((resolve, reject) => {
    // Determine resource_type dynamically – this is the key fix for PDFs
    const isImage = mimetype?.startsWith("image/");
    const resourceType = isImage ? "image" : "raw";  // ← PDFs, docs, etc. → raw

    console.log(`Uploading ${originalname} as ${resourceType} (mime: ${mimetype})`);

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "activline/chat",
        resource_type: resourceType,           // Critical: "raw" for non-images
        use_filename: true,
        unique_filename: true,
        filename_override: originalname,       // Preserves original name + extension
        public_id: `${Date.now()}-${originalname
          .replace(/\.[^/.]+$/, "")           // remove extension for clean public_id
          .replace(/[^a-zA-Z0-9-_]/g, "_")}`, // sanitize
        // Optional but helpful for debugging / organization
        tags: ["chat-upload", isImage ? "image" : "document"],
        // If you ever need eager PDF-to-image conversion (thumbnail), add:
        // eager: [{ page: 1, format: "jpg", width: 300, crop: "limit" }],
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", {
            message: error.message,
            http_code: error.http_code,
            details: error
          });
          reject(error);
        } else {
          console.log(`Upload success: ${result.public_id} (${result.resource_type})`);
          resolve(result);
        }
      }
    );

    // Stream the buffer safely
    const readable = Readable.from(buffer);
    readable.on("error", (err) => {
      console.error("Readable stream error:", err);
      reject(err);
    });

    readable.pipe(uploadStream);
  });
};