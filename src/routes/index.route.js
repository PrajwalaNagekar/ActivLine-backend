import { Router } from "express";
import authRoutes from "./auth/index.js";
import franchiseRoutes from "./franchise/index.js";
import userRoutes from "./user/index.route.js";
import chatRoutes from "./chat/chat.index.js";
import adminIndex from "./admin/index.js";
import customerIndex from "./customer/index.js";
const router = Router();

router.use("/auth", authRoutes);   // 🔐 LOGIN HERE
router.use("/franchise", franchiseRoutes);
router.use("/users", userRoutes);
router.use("/chat", chatRoutes);
router.use("/admin", adminIndex);
router.use("/customer", customerIndex);
// future:
// router.use("/staff", staffRoutes);

export default router;
