import User from "../../models/Customer/user.model.js";

export const findByMobile = (mobile) => {
  return User.findOne({ mobile });
};

export const findByIdentifier = (identifier) => {
  return User.findOne({
    $or: [
      { mobile: identifier },
      { email: identifier.toLowerCase() },
    ],
  });
};

export const createCustomer = (data) =>
  User.create(data);
