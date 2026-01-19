// src/routes/chat/chat.index.js
import { Router } from "express";
import adminRoutes from "./chat.admin.routes.js";
import userRoutes from "./chat.user.routes.js";
import staffRoutes from "./chat.staff.routes.js";
const router = Router();

router.use("/admin", adminRoutes);
router.use("/user", userRoutes);
router.use("/staff", staffRoutes);
export default router;
