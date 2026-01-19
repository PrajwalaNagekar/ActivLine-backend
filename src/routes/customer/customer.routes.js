import express from "express";
import { createCustomer ,loginCustomer} from "../../controllers/Customer/customer.controller.js";

const router = express.Router();

router.post(
  "/create",
  createCustomer
);
router.post("/login", loginCustomer);
export default router;
