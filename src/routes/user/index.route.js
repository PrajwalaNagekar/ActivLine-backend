import { Router } from "express";
import authRoutes from "./userauth.routes.js";
// future: profile.routes.js, billing.routes.js
import newConnectionRoutes from "./newConnection.routes.js";
const router = Router();

// 🔐 Authentication routes
router.use("/auth", authRoutes);
router.use("/", newConnectionRoutes);
export default router;
