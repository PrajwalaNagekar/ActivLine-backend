import activlineClient from "../../external/activline/activline.client.js";

export const getGroupDetails = async () => {
  return await activlineClient.get("/get_group_details");
};
