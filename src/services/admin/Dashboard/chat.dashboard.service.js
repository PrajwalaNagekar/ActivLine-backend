import * as Repo from "../../repositories/chat/chat.dashboard.repository.js";

export const getDashboardStats = async () => {
  const [
    openTickets,
    inProgressTickets,
    todayResolvedTickets,
    totalCustomers,
  ] = await Promise.all([
    Repo.countByStatus("OPEN"),
    Repo.countByStatus("IN_PROGRESS"),
    Repo.countResolvedToday(),
    Repo.countCustomers(),
  ]);

  return {
    openTickets,
    inProgressTickets,
    todayResolvedTickets,
    totalCustomers,
  };
};

export const getRecentTickets = async (limit) => {
  const rooms = await Repo.getRecentRooms(limit);

  return rooms.map((r) => ({
    ticketId: r._id,
    subject: "Customer Support Chat", // static subject
    customer: r.customer?.fullName || "Unknown",
    status: r.status,
    createdAt: r.createdAt,
  }));
};
