import activlineClient from "../../external/activline/activline.client.js";

export const createLeadRepo = async (payload) => {
  const response = await activlineClient.post("/add_lead", payload);
  return response.data;
};
