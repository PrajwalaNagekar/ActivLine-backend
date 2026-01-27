import { getAdminTicketsService } from "../../../services/admin/Ticket/adminTicket.service.js";
import { validateAdminTickets } from "../../../validations/admin/Ticket/adminTicket.validator.js";
import ApiResponse from "../../../utils/ApiReponse.js";

export const getAdminTickets = async (req, res) => {
  const { isValid, errors } = validateAdminTickets(req.body);

  if (!isValid) {
    return res.status(400).json(
      ApiResponse.error("Validation failed", errors)
    );
  }

  const data = await getAdminTicketsService(req.body);

  return res.status(200).json(
    ApiResponse.success(data, "Tickets fetched successfully")
  );
};
