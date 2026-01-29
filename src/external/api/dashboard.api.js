import activlineClient from "../activline/activline.client";

export const getUserSessionDetails = (userId, fromDate, toDate) => {
  return activlineClient.get(
    `/get_usersession_details/${userId}/${fromDate}/${toDate}`
  );
};
