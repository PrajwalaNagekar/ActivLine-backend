import { Router } from "express";
import activityLogRoutes from "./activityLog.routes.js";

const router = Router();

router.use("/", activityLogRoutes);

export default router;
