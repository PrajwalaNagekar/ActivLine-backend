import Customer from "../../models/Customer/customers.model.js";
import jwt from "jsonwebtoken";


// ✅ CREATE CUSTOMER
export const createCustomer = async (req, res) => {
  try {
    const { fullName, mobile, email, password, role } = req.body;

    if (!fullName || !mobile || !password) {
      return res.status(400).json({
        success: false,
        message: "fullName, mobile and password are required",
      });
    }

    // Check existing mobile
    const exists = await Customer.findOne({ mobile });
    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Customer already exists with this mobile number",
      });
    }

    const customer = await Customer.create({
      fullName,
      mobile,
      email,
      password,
      role: role || "CUSTOMER",
    });

    res.status(201).json({
      success: true,
      message: "Customer created successfully",
      data: {
        id: customer._id,
        fullName: customer.fullName,
        mobile: customer.mobile,
        email: customer.email,
        role: customer.role,
      },
    });
  } catch (error) {
    console.error("CREATE CUSTOMER ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ✅ LOGIN CUSTOMER
export const loginCustomer = async (req, res) => {
  try {
    const { mobile, password } = req.body;

    if (!mobile || !password) {
      return res.status(400).json({
        success: false,
        message: "mobile and password are required",
      });
    }

    const customer = await Customer.findOne({ mobile });
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    const isMatch = await customer.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    const accessToken = jwt.sign(
      { _id: customer._id, role: customer.role, email: customer.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1d" }
    );

    const refreshToken = jwt.sign(
      { _id: customer._id },
      process.env.REFRESH_TOKEN_SECRET || "refresh-secret",
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "10d" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        id: customer._id,
        fullName: customer.fullName,
        mobile: customer.mobile,
        email: customer.email,
        role: customer.role,
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
