import { Router } from "express";
import dashboardRoutes from "./dashboard.routes.js";

const router = Router();

router.use("/", dashboardRoutes);

export default router;
