import { Router } from "express";
import leadRoutes from "./lead.routes.js";

const router = Router();

// /api/customer/lead
router.use("/lead", leadRoutes);

export default router;
