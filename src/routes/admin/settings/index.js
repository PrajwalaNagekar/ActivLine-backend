import { Router } from "express";
import settingsRoutes from "./settings.routes.js";
import cannedCategoryRoutes from "./cannedCategory.routes.js";
import cannedResponseRoutes from "./cannedResponse.routes.js";


const router = Router();

/**
 * /api/admin/settings
 */
router.use("/", settingsRoutes);
router.use("/canned", cannedResponseRoutes);
router.use("/canned", cannedCategoryRoutes);        
export default router;
