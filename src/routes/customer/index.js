import { Router } from "express";
import leadRoutes from "./lead.routes.js";
import customerRoutes from "./customer.routes.js";
import profile from "./profile.routes.js";
import customerAuthRoutes from "./customer.login.routes.js";

const router = Router();

router.use("/", customerAuthRoutes);
// /api/customer/lead
router.use("/lead", leadRoutes);
router.use("/profile", profile);
// /api/customer/create, /api/customer/login, etc.
router.use("/", customerRoutes);

export default router;
