import { Router } from "express";
import { getNotifications } from "../../controllers/Notification/notification.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";

const router = Router();

/**
 * GET /api/notifications
 * admin | super_admin | staff
 */
router.get("/", verifyJWT, getNotifications);

export default router;
