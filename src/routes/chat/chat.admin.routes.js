import { Router } from "express";
import {  getAllRooms,assignStaff ,getRoomMessages,updateTicketStatus } from "../../controllers/chat/chat.admin.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { allowRoles } from "../../middlewares/role.middleware.js";

const router = Router();
router.get(
  "/rooms",
  verifyJWT,
  allowRoles("ADMIN", "SUPER_ADMIN"),
  getAllRooms
);
router.post(
  "/assign",
  verifyJWT,
  allowRoles("ADMIN", "SUPER_ADMIN"),
  assignStaff
);
router.patch(
  "/status",
  verifyJWT,
  allowRoles("ADMIN", "SUPER_ADMIN", "ADMIN_STAFF"),
  updateTicketStatus
);
router.get(
  "/messages/:roomId",
  verifyJWT,
  allowRoles("ADMIN", "SUPER_ADMIN", "ADMIN_STAFF"),
  getRoomMessages
);
export default router;
