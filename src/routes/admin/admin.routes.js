import { Router } from "express";
import { getAllStaff } from "../../controllers/Admin/admin.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { getAdminStaff } from "../../controllers/Admin/admin.controller.js";
import { allowRoles } from "../../middlewares/role.middleware.js";
const router = Router();

router.get("/dashboard", (req, res) => {
  res.json({
    success: true,
    message: "Admin dashboard access granted",
    admin: req.user,
  });
});

router.get(
  "/staff",
  verifyJWT,
  allowRoles("ADMIN"),
  getAllStaff
);
router.get("/staff", verifyJWT, getAdminStaff);

export default router;
