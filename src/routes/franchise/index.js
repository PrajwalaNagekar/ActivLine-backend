import { Router } from "express";
import franchiseRoutes from "./franchise.routes.js";

const router = Router();

router.use("/", franchiseRoutes);

export default router;
