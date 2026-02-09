import activlineClient from "../../external/activline/activline.client.js";


export const getAllAdmins = async (accountId) => {
  const payload = new URLSearchParams();
  payload.append("accountId", accountId);

  return await activlineClient.post(
    "/get_all_admins",
    payload,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
};

