import { Router } from "express";
import activityLogIndex from "./Activitylog/index.js";

const router = Router();

// /api/logs/activity
router.use("/activity", activityLogIndex);

export default router;
