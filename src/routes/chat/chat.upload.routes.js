import { Router } from "express";
import adminRoutes from "./chat.admin.routes.js";
import userRoutes from "./chat.user.routes.js";
import staffRoutes from "./chat.staff.routes.js";
import { uploadChatFiles } from "../../controllers/chat/chat.upload.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
const router = Router();

router.post(
  "/upload",
  verifyJWT,
  uploadChatFiles
);

export default router;
