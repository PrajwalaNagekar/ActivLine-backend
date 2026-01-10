import { Router } from "express";
import authRoutes from "./auth.routes.js";
import profileRoutes from "./profile.routes.js";

const router = Router();

// login, create
router.use("/", authRoutes);

// get/edit profile
router.use("/", profileRoutes);

export default router;
