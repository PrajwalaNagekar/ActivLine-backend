import { asyncHandler } from "../../utils/AsyncHandler.js";
import { createLeadSchema } from "../../validations/Customer/lead.validation.js";
import { createLeadService } from "../../services/customer/lead.service.js";
import { notifyAdminsOnLeadCreate } 
  from "../../services/Notification/notification.service.js";
import { ApiResponse } from "../../utils/ApiReponse.js";

export const createLead = asyncHandler(async (req, res) => {
  const { error, value } = createLeadSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res.status(400).json({
      success: false,
      errors: error.details.map((e) => e.message),
    });
  }

  // ✅ Create lead
  const lead = await createLeadService(value);

  res.status(201).json(
    ApiResponse.success(lead, "Lead created successfully")
  );
});
