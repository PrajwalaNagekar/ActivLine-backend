import { Router } from "express";
import { adminLogin } from "../controllers/Admin/admin.auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { adminLogout } from "../controllers/Admin/admin.auth.controller.js";

const router = Router();
router.post("/login", adminLogin);
router.post("/logout", verifyJWT, adminLogout);
export default router;