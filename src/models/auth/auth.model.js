import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const adminSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  // phone: { type: String, unique: true, sparse: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["ADMIN", "FRANCHISE", "ADMIN_STAFF"],
    default: "ADMIN",
  },
   fcmToken: {
      type: String,
      default: null, // 🔥 future-ready
    },
    
  refreshToken: { type: String, default: null },
}, { timestamps: true });

adminSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

adminSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

adminSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { _id: this._id, role: this.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
};

adminSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
};

export default mongoose.model("Admin", adminSchema);
