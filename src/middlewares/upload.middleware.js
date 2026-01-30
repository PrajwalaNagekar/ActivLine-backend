import multer from "multer";
import path from "path";

const storage = multer.memoryStorage({
  destination: "uploads/chat",
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ["image/png", "image/jpeg", "application/pdf"];
  if (!allowed.includes(file.mimetype)) {
    return cb(new Error("Only images and PDFs allowed"));
  }
  cb(null, true);
};

export const chatUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024, // 🔥 CUSTOM SIZE → 20MB (change anytime)
  },
});
