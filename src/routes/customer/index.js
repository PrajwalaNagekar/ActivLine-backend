import { Router } from "express";
import customerRoutes from "./customers.routes.js";

const router = Router();

router.use("/", customerRoutes);

export default router;
