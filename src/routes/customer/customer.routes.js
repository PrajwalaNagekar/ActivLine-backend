import express from "express";
import { createCustomer, updateCustomer,getMyProfile } from "../../controllers/Customer/customer.controller.js";
import { upload } from "../../middlewares/multer.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { createCustomerSchema } from "../../validations/Customer/customer.validation.js";
import { loginCustomer } from "../../controllers/Customer/customer.controller.js";
import { verifyAccessToken } from "../../middlewares/auth.middleware.js";
const router = express.Router();

router.post(
  "/create",
  upload.fields([
    { name: "idFile", maxCount: 1 },
    { name: "addressFile", maxCount: 1 },
  ]),
  validate(createCustomerSchema), // ✅ validation after multer
  createCustomer
);

router.post(
  "/update/:activlineUserId",
  upload.fields([
    { name: "idFile", maxCount: 1 },
    { name: "addressFile", maxCount: 1 },
  ]),
  updateCustomer
);


router.post("/login", express.json(), upload.none(), loginCustomer);

router.get("/me", verifyAccessToken, getMyProfile);
export default router;
