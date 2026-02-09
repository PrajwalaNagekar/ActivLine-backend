import { Router } from "express";
import { verifyJWT } from "../../../middlewares/auth.middleware.js";
import { allowRoles } from "../../../middlewares/role.middleware.js";
import * as Controller from "../../../controllers/Activitylogs/logs.controller.js";

const router = Router();

/**
 * ✅ GET ALL LOGS
 * ADMIN | SUPER_ADMIN | ADMIN_STAFF
 * GET /api/logs/activity
 */
router.get(
  "/",
  verifyJWT,
  allowRoles("ADMIN", "SUPER_ADMIN", "ADMIN_STAFF"),
  Controller.getAllLogs
);

/**
 * ✅ GET LOGS BY USER ID
 * ADMIN | SUPER_ADMIN
 * GET /api/logs/activity/user/:userId
 */
router.get(
  "/user/:userId",
  verifyJWT,
  allowRoles("ADMIN", "SUPER_ADMIN"),
  Controller.getLogsByUser
);

/**
 * ✅ GET MY LOGS
 * ANY LOGGED-IN USER
 * GET /api/logs/activity/me
 */
router.get(
  "/me",
  verifyJWT,
  Controller.getMyLogs
);

export default router;
