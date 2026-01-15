import NewConnection from "../../models/user/newConnection.model.js";

class NewConnectionRepository {
  create(data) {
    return NewConnection.create(data);
  }

  findByMobile(mobile) {
    return NewConnection.findOne({ mobile });
  }

  findAll() {
    return NewConnection.find().sort({ createdAt: -1 });
  }

  updateStatus(id, status) {
    return NewConnection.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
  }
}

export default new NewConnectionRepository();
