import activlineClient from "./activline.client.js";

export const fetchAllTickets = (formData) => {
  return activlineClient.post("/get_all_tickets", formData)
    .then(res => res.data);
};
