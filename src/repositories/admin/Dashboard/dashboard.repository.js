import ChatRoom from "../../../models/chat/chatRoom.model.js";

/* OPEN TICKETS */
export const countOpenTickets = () =>
  ChatRoom.countDocuments({ status: "OPEN" });

/* IN PROGRESS */
export const countInProgressTickets = () =>
  ChatRoom.countDocuments({
    status: { $in: ["ASSIGNED", "IN_PROGRESS"] },
  });

/* TODAY RESOLVED */
export const countTodayResolvedTickets = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  return ChatRoom.countDocuments({
    status: "RESOLVED",
    updatedAt: { $gte: start, $lte: end },
  });
};

/* DISTINCT CHAT CUSTOMERS */
export const countDistinctCustomers = async () => {
  const ids = await ChatRoom.distinct("customer", {
    customer: { $ne: null },
  });
  return ids.length;
};

/* RECENT TICKETS */
export const getRecentTickets = (limit = 5) =>
  ChatRoom.find()
    .populate("customer", "fullName email")
    .sort({ updatedAt: -1 })
    .limit(limit);


   export const countRoomsAssignedToStaff = () =>
  ChatRoom.countDocuments({
    customer: { $ne: null },       // created by customer
    assignedStaff: { $ne: null },  // assigned by admin
  });