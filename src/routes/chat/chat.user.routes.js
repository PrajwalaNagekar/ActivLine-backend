import { Router } from "express";
import { openChat,getMyMessages,getMyChatRooms } from "../../controllers/chat/chat.user.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/open", verifyJWT, openChat);
router.get("/messages/:roomId", verifyJWT, getMyMessages);
router.get(
  "/my-rooms",
  verifyJWT,          // your customer auth middleware
  getMyChatRooms
);

export default router;
