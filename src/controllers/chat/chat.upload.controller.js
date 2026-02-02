import { asyncHandler } from "../../utils/AsyncHandler.js";
import ApiResponse from "../../utils/ApiReponse.js";
import { chatUpload } from "../../middlewares/upload.middleware.js";
import { uploadToCloudinary } from "../../utils/cloudinaryUpload.js";
import ChatMessage from "../../models/chat/chatMessage.model.js";
import { getIO } from "../../socket/index.js";

export const uploadChatFiles = asyncHandler(async (req, res) => {
  // 1️⃣ Handle Multipart Upload (Promisified)
  await new Promise((resolve, reject) => {
    chatUpload.array("files", 5)(req, res, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });

  // 2️⃣ Process Files & Message
  const { roomId, message: textMessage } = req.body;

  if (!roomId) {
    return res.status(400).json(ApiResponse.error("Room ID is required"));
  }

  const attachments = [];

  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      try {
        const uploaded = await uploadToCloudinary(file);
        attachments.push({
          url: uploaded.secure_url,
          name: file.originalname,
          size: uploaded.bytes, // ✅ Use actual stored size from Cloudinary

          // 🔑 IMPORTANT
          mimeType: file.mimetype, // application/pdf
          extension: file.originalname.split(".").pop().toLowerCase(),

          // UI helper only
          type:
            uploaded.resource_type === "image" && uploaded.format !== "pdf"
              ? "image"
              : "file",
        });
      } catch (uploadError) {
        console.error("File upload failed:", uploadError);
        return res
          .status(500)
          .json(ApiResponse.error("Failed to upload files"));
      }
    }
  }

  if (attachments.length === 0 && (!textMessage || !textMessage.trim())) {
    return res.status(400).json(ApiResponse.error("Message or files required"));
  }

  // ✅ CREATE CHAT MESSAGE
  const message = await ChatMessage.create({
    roomId,
    senderId: req.user._id,
    senderRole: req.user.role,
    senderModel: req.user.role === "CUSTOMER" ? "Customer" : "Admin",
    message: textMessage || "",
    messageType:
      attachments.length > 0
        ? attachments.some((a) => a.type === "image")
          ? "IMAGE"
          : "FILE"
        : "TEXT",
    attachments,

    // 🔥 ADD THIS LINE (VERY IMPORTANT)
    tempId: req.body.tempId || null,
  });

  const populated = await ChatMessage.findById(message._id).populate(
    "senderId",
    "fullName email role"
  );

  // ✅ EMIT SOCKET (THIS IS WHAT MAKES CHAT WORK)
  getIO().to(roomId).emit("new-message", populated);

  res.json(ApiResponse.success(populated, "Message sent successfully"));
});
