import { Router } from "express";
import authRoutes from "./auth/index.js";
import adminRoutes from "./admin/index.js";
import franchiseRoutes from "./franchise/index.js";
import userRoutes from "./user/index.route.js";
const router = Router();

router.use("/auth", authRoutes);   // 🔐 LOGIN HERE
router.use("/franchise", franchiseRoutes);
router.use("/users", userRoutes);
router.use("/", adminRoutes);
// future:
// router.use("/staff", staffRoutes);

export default router;
