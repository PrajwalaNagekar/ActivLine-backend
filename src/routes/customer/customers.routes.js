import { Router } from "express";
import { createCustomer, loginCustomer } from "../../controllers/Customer/customers.controller.js";

const router = Router();

// CREATE CUSTOMER
router.post("/creates", createCustomer);

// LOGIN CUSTOMER
router.post("/logins", loginCustomer);

export default router;
