import { Router } from "express";
import authRoutes from "./auth/index.js";
import franchiseRoutes from "./franchise/index.js";
import userRoutes from "./user/index.route.js";
import chatRoutes from "./chat/chat.index.js";
import adminIndex from "./admin/index.js";
import customerIndex from "./customer/index.js";
import staffIndex from "./staff/index.js";
import dashboardRoutes from "./admin/Dashboard/dashboard.routes.js"; // ✅ ADD THIS
const router = Router();

router.use("/auth", authRoutes);   // 🔐 LOGIN HERE
router.use("/franchise", franchiseRoutes);
router.use("/users", userRoutes);
router.use("/chat", chatRoutes);
router.use("/admin", adminIndex);
router.use("/customer", customerIndex);
router.use("/staff", staffIndex); 
router.use("/dashboard", dashboardRoutes);
// future:
// router.use("/staff", staffRoutes);

export default router;
