
import activlineClient from "../../../config/Jaze_API/Ticket/activline.config.js";

export const getTicketsFromActivline = async (formData) => {
  const response = await activlineClient.post(
    "/get_all_tickets",
    formData
  );

  return response.data;
};
