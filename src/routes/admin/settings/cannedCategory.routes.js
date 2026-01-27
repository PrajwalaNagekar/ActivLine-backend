import { Router } from "express";
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "../../../controllers/Admin/settings/cannedCategory.controller.js";

import { verifyJWT } from "../../../middlewares/auth.middleware.js";
import { allowRoles } from "../../../middlewares/role.middleware.js";
import { ROLES } from "../../../constants/roles.js";

const router = Router();

/**
 * 📖 GET ALL CATEGORIES
 * Roles allowed:
 * - SUPER_ADMIN
 * - ADMIN
 * - ADMIN_STAFF
 */
router.get(
  "/categories",
  verifyJWT,
  allowRoles(
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN,
    ROLES.ADMIN_STAFF
  ),
  getCategories
);

/**
 * ➕ CREATE CATEGORY
 * Role:
 * - SUPER_ADMIN only
 */
router.post(
  "/categories",
  verifyJWT,
  allowRoles(ROLES.SUPER_ADMIN),
  createCategory
);

/**
 * ✏️ UPDATE CATEGORY
 * Role:
 * - SUPER_ADMIN only
 */
router.put(
  "/categories/:id",
  verifyJWT,
  allowRoles(ROLES.SUPER_ADMIN),
  updateCategory
);

/**
 * 🗑️ DELETE CATEGORY
 * Role:
 * - SUPER_ADMIN only
 */
router.delete(
  "/categories/:id",
  verifyJWT,
  allowRoles(ROLES.SUPER_ADMIN),
  deleteCategory
);

export default router;
