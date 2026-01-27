import { fetchAllTickets } from "../../../external/activline/activline.ticket.api.js";
import ApiError from "../../../utils/ApiError.js";

export const getAdminTicketsService = async ({ page, perPage }) => {
  const formData = new URLSearchParams();

  formData.append("adminUsername", "adminnoc");
  formData.append("page", String(page));
  formData.append("perPage", String(perPage));

  try {
    return await fetchAllTickets(formData.toString());
  } catch (err) {
    throw new ApiError(502, "External ticket service failed");
  }
};
