import mongoose from "mongoose";
import dotenv from "dotenv";
import seedAdmin from "../seeders/SeedAdmin.js";

dotenv.config();

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI, {
            dbName: process.env.DB_NAME,
        });

        console.log(
            `MongoDB connected! Host: ${connectionInstance.connection.host}`
        );

        // ✅ Seed AFTER DB connection
        await seedAdmin();

    } catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1);
    }
};

export default connectDB;
