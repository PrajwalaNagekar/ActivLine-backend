import { Router } from "express";
import adminStaffRoutes from "./adminStaff.routes.js";

const router = Router();

// /api/staff/admin-staff
router.use("/admin-staff", adminStaffRoutes);

export default router;
