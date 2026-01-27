import { Router } from "express";
import authRoutes from "./auth.routes.js";
import profileRoutes from "./profile.routes.js";
import logoutRoutes from "./logout.routes.js";
import forgotRoutes from "./forgot.routes.js";
const router = Router();

// login, create
router.use("/", authRoutes);

// get/edit profile
router.use("/", profileRoutes);
router.use("/", logoutRoutes);
router.use("/", forgotRoutes);
export default router;
