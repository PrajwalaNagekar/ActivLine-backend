import activlineClient from "../../../config/Jaze_API/Ticket/activline.config.js";
import ApiError from "../../../utils/ApiError.js";

export const getAdminTicketsService = async ({ page, perPage }) => {
  const formData = new URLSearchParams();

  formData.append("adminUsername", "adminnoc");
  formData.append("page", String(page));
  formData.append("perPage", String(perPage));

  try {
    const response = await activlineClient.post(
      "/get_all_tickets",
      formData.toString()
    );

    return response.data;
  } catch (err) {
    console.error("❌ Activline error:", err.response?.data);

    throw new ApiError(
      err.response?.status || 500,
      "External ticket service failed"
    );
  }
};
