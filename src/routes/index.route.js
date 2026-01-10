import { Router } from "express";
import authRoutes from "./auth/index.js";
import adminRoutes from "./admin/index.js";
import franchiseRoutes from "./franchise/index.js";

const router = Router();

router.use("/auth", authRoutes);   // 🔐 LOGIN HERE
router.use("/", adminRoutes);
router.use("/franchise", franchiseRoutes);

// future:
// router.use("/staff", staffRoutes);

export default router;
