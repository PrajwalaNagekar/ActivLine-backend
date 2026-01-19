import { Router } from "express";
import {  getAllRooms,assignStaff ,getRoomMessages, } from "../../controllers/chat/chat.admin.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { allowRoles } from "../../middlewares/role.middleware.js";

const router = Router();
router.get(
  "/rooms",
  verifyJWT,
  allowRoles("ADMIN"),
  getAllRooms
);
router.post(
  "/assign",
  verifyJWT,
  allowRoles("ADMIN"),
  assignStaff
);
router.get("/messages/:roomId", getRoomMessages);
export default router;
