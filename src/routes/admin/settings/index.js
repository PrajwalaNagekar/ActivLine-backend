// routes/admin/settings/index.js
import { Router } from "express";
import settingsRoutes from "./settings.routes.js";

const router = Router();

/**
 * /api/admin/settings
 */
router.use("/", settingsRoutes);

export default router;
