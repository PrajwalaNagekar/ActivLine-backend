// models/User.js
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";

const customerSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true },
    email: { type: String, trim: true, lowercase: true, default: null },
    referralCode: {
        type: String,
        unique: true,
        default: () => nanoid(8).toUpperCase(),
    },
    referredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    referralHistory: [
        {
            referredUser: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
            referredUserName: {
                // Store name for easier display without extra lookup
                type: String,
                required: true,
            },
            amountEarned: {
                type: Number,
                required: true,
            },
            referredAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],

    fcmTokens: {
        type: [String],
        default: [],
    },

    // 👇 New fields for tokens
    refreshToken: { type: String, default: null },

    createdAt: { type: Date, default: Date.now },
});

// Ensure referral code is generated on creation
customerSchema.pre("save", function (next) {
    if (this.isNew && !this.referralCode) {
        this.referralCode = nanoid(8).toUpperCase();
    }
    next();
});

// 👇 Method to generate Access Token
customerSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        { _id: this._id, phone: this.phone },
        process.env.ACCESS_TOKEN_SECRET,

        { expiresIn: "2d" }
    );
};

// 👇 Method to generate Refresh Token
customerSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        { _id: this._id, phone: this.phone },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
    );
};

export default mongoose.model("Customer", customerSchema);
