// routes/admin/settings/settings.routes.js
import { Router } from "express";
import {
  getGeneralSettings,
  updateGeneralSettings,
} from "../../../controllers/Admin/settings/generalSettings.controller.js";

import { isSuperAdmin } from "../../../middlewares/auth.middleware.js";

const router = Router();

/**
 * 📖 GET General Settings
 * Used by Admin Panel (view)
 */
router.get("/general", getGeneralSettings);

/**
 * ✏️ UPDATE General Settings
 * Super Admin only
 */
router.put("/general", isSuperAdmin, updateGeneralSettings);

export default router;
