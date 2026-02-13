import { Router } from "express";
import adminStaffRoutes from "./adminStaff.routes.js";
import staffStatsRoutes from "../staff/chat/chat.staff.stats.routes.js";
import staffNotificationRoutes from "./notification.routes.js";
const router = Router();

// /api/staff/admin-staff
router.use("/admin-staff", adminStaffRoutes);
router.use("/", staffNotificationRoutes);
router.use("/", staffStatsRoutes);
export default router;
