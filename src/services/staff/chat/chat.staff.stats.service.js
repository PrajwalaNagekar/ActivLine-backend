import * as Repo from "../../../repositories/staff/chat/chat.staff.stats.repository.js";

export const getOpenTickets = async (staffId) =>
  Repo.findByStatusForStaff(staffId, "OPEN");

export const getInProgressTickets = async (staffId) =>
  Repo.findByStatusForStaff(staffId, "IN_PROGRESS");

export const getResolvedTickets = async (staffId) =>
  Repo.findByStatusForStaff(staffId, "RESOLVED");

export const getClosedTickets = async (staffId) =>
  Repo.findByStatusForStaff(staffId, "CLOSED");

export const getTotalTickets = async (staffId) =>
  Repo.findByStatusForStaff(staffId); // no status filter
