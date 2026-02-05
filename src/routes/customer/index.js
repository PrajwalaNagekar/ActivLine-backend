import { Router } from "express";
import leadRoutes from "./lead.routes.js";
import customerRoutes from "./customer.routes.js";

const router = Router();

// /api/customer/lead
router.use("/lead", leadRoutes);

// /api/customer/create, /api/customer/login, etc.
router.use("/", customerRoutes);

export default router;
