import { Router } from "express";
import authRoutes from "./auth.routes.js";
import customerRoutes from "./customer.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/", customerRoutes);

export default router;
