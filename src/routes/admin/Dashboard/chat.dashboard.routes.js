import { Router } from "express";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { allowRoles } from "../../middlewares/role.middleware.js";
import {
  getDashboardStats,
  getRecentTickets,
} from "../../controllers/chat/chat.dashboard.controller.js";

const router = Router();

router.get(
  "/stats",
  verifyJWT,
  allowRoles("ADMIN"),
  getDashboardStats
);

router.get(
  "/recent",
  verifyJWT,
  allowRoles("ADMIN"),
  getRecentTickets
);

export default router;
