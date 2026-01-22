import ChatRoom from "../../../models/chat/chatRoom.model.js";

export const findByStatusForStaff = async (staffId, status) => {
  const query = { assignedStaff: staffId };

  if (status) {
    query.status = status;
  }

  const rooms = await ChatRoom.find(query).sort({ updatedAt: -1 });
  const count = rooms.length;

  return { count, rooms };
};
