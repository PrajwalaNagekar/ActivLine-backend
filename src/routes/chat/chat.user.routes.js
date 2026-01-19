import { Router } from "express";
import { openChat,getMyMessages } from "../../controllers/chat/chat.user.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/open", verifyJWT, openChat);
router.get("/messages/:roomId",  getMyMessages);

export default router;
