import repo from "../../repositories/user/newConnection.repository.js";
import { ApiError } from "../../utils/ApiError.js";

class NewConnectionService {
  async createLead(data) {
    // Prevent duplicate leads
    const existing = await repo.findByMobile(data.mobile);
    if (existing) {
      throw new ApiError(
        409,
        "A connection request already exists for this mobile number"
      );
    }

    return repo.create(data);
  }

  async getAllLeads() {
    return repo.findAll();
  }

  async updateLeadStatus(id, status) {
    return repo.updateStatus(id, status);
  }
}

export default new NewConnectionService();
