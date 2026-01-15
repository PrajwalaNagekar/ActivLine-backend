import User from "../../models/user/user.model.js";

class UserRepository {
  create(data) {
    return User.create(data);
  }

  findByMobile(mobile) {
    return User.findOne({ mobile });
  }

  findByCustomerId(customerId) {
    return User.findOne({ customerId });
  }

  findById(id) {
    return User.findById(id);
  }

  findByResetToken(token) {
    return User.findOne({ passwordResetToken: token });
  }

  updateById(id, data) {
    return User.findByIdAndUpdate(id, data, { new: true });
  }
}

export default new UserRepository();
