import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "../src/models/admin.model.js";

dotenv.config();

const MONGODB_URL = process.env.MONGODB_URL;

// Convert comma-separated env values into arrays
const NAMES = process.env.ADMIN_NAMES?.split(",");
const EMAILS = process.env.ADMIN_EMAILS?.split(",");
const PHONES = process.env.ADMIN_PHONES?.split(",");
const PASSWORDS = process.env.ADMIN_PASSWORDS?.split(",");
const TYPES = process.env.ADMIN_TYPES?.split(",");

const seedAdmins = async () => {
    try {
        await mongoose.connect(MONGODB_URL);
        console.log("✅ Connected to MongoDB");

        for (let i = 0; i < EMAILS.length; i++) {
            const email = EMAILS[i];

            const exists = await Admin.findOne({ email });
            if (exists) {
                console.log(`⚠️  Admin already exists: ${email}`);
                continue;
            }

            await Admin.create({
                name: NAMES[i],
                email,
                phone: PHONES[i],
                password: PASSWORDS[i], // 🔐 hashed by pre-save hook
                userType: TYPES[i] || "Admin",
                createdBy: null,
            });

            console.log(`✅ Admin created: ${email}`);
        }

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error("❌ Admin seeding failed:", error);
        process.exit(1);
    }
};

seedAdmins();
