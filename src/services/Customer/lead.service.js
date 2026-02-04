import { LeadModel } from "../../models/Customer/lead.model.js";
import { createLeadRepo } from "../../repositories/Customer/lead.repository.js";
import { notifyAdminsOnLeadCreate } from "../Notification/notification.service.js";

export const createLeadService = async (payload) => {
  const lead = new LeadModel(payload);
  const cleanPayload = LeadModel.sanitize(lead);

  let activlineResponse = null;

  try {
    activlineResponse = await createLeadRepo(cleanPayload);
  } catch (err) {
    // Log the error but don't stop the process.
    console.error("Activline lead creation failed:", err.message);
  }

  // Create a notification for admins with the full lead data.
  await notifyAdminsOnLeadCreate(cleanPayload);

  return {
    submittedData: cleanPayload,
    activlineResponse,
  };
};
