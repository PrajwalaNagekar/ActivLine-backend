import { Router } from "express";
import {
  getGeneralSettings,
  updateGeneralSettings,
} from "../../../controllers/Admin/settings/generalSettings.controller.js";

import { verifyJWT } from "../../../middlewares/auth.middleware.js";
import { allowRoles } from "../../../middlewares/role.middleware.js";
import { ROLES } from "../../../constants/roles.js";

const router = Router();

/**
 * 📖 GET → Super Admin + Admin
 */
router.get(
  "/general",
  verifyJWT,
  allowRoles(
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN,
    ROLES.ADMIN_STAFF,
    ROLES.CUSTOMER
  ),
  getGeneralSettings
);


/**
 * ✏️ UPDATE → Super Admin only
 */
router.put(
  "/general",
  verifyJWT,
  allowRoles(ROLES.SUPER_ADMIN),
  updateGeneralSettings
);

export default router;
