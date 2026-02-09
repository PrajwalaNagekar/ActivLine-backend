import { Router } from "express";
import {
  fetchCountries,
  fetchStates,
  fetchCities
} from "../../controllers/Customer/location.controller.js";

import {
  autoFillByIndianPin,
  validateAndAutoFillPin
} from "../../controllers/Customer/pinValidate.controller.js";

// import { validateAndAutoFillPin } from "../../controllers/Customer/pinValidate.controller.js";
const router = Router();

router.get("/countries", fetchCountries);
router.get("/states/:countryCode", fetchStates);
router.get("/cities/:countryCode/:stateCode", fetchCities);
// ✅ MISSING API (ADD THIS)
router.get("/pin/india/:pin", autoFillByIndianPin);
router.post("/pin/validate", validateAndAutoFillPin);

export default router;
