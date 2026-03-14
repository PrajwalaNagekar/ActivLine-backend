// controllers/activline.controller.js
import { getUsersFromActivline } from "../../services/Customer/activline.servise.js";
import { getProfileDetailsFromActivline } from "../../services/Customer/activline.servise.js";

export const getFilteredUsers = async (req, res) => {
  const { page = 1, perPage = 10 } = req.params;

  const apiResponse = await getUsersFromActivline(page, perPage);

  const filteredData = apiResponse.data.map(user => ({
    username: user.username,
    name: user.name,
    last_name: user.last_name,
    email: user.email,
    company_name: user.company_name,
    status: user.status,
  }));

  res.json({
    status: "success",
    errorCode: 200,
    totalRecords: apiResponse.totalRecords,
    data: filteredData,
  });
};

export const getProfileDetails = async (req, res) => {
  const { profileId } = req.params;

  const apiResponse = await getProfileDetailsFromActivline(profileId);

  res.json(apiResponse);
};
