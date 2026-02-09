import activlineClient from "../../external/activline/activline.client.js";

export const getSubPlans = async (groupId) => {
  if (!groupId) {
    throw new Error("groupId is required");
  }

  return await activlineClient.get(`/get_sub_plans/${groupId}`);
};
