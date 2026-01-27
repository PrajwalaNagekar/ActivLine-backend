import { Router } from "express";
import { createNewConnection } from "../../controllers/user/newConnection.controller.js";

const router = Router();

// PUBLIC – NO AUTH
router.post("/new-connection", createNewConnection);

export default router;
