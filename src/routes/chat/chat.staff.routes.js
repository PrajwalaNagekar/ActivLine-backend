import express from "express";
import { getAssignedRooms ,getAssignedRoomMessages } from "../../controllers/chat/chat.staff.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { allowRoles } from "../../middlewares/role.middleware.js";
const router = express.Router();

router.get("/rooms", verifyJWT, getAssignedRooms);

router.get(
  "/messages/:roomId",
  verifyJWT,
  allowRoles("ADMIN_STAFF"),
  getAssignedRoomMessages
);
export default router;
