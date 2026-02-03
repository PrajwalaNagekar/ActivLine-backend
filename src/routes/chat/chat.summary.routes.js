import { Router } from "express";
import { getChatRoomSummary } from "../../controllers/chat/chat.summary.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js"; // ✅ CORRECT

const router = Router();

// GET /api/chat/rooms/:roomId/summary
router.get(
  "/rooms/:roomId/summary",
  verifyJWT,              // ✅ USE THIS
  getChatRoomSummary
);

export default router;
