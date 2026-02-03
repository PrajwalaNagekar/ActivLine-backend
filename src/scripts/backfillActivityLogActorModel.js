import mongoose from "mongoose";
import dotenv from "dotenv";
import ActivityLog from "../src/models/ActivityLog/activityLog.model.js";

dotenv.config({ path: "./.env" });

const run = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in .env file");
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("🗄️  Database connected.");

    const operations = [];
    const rolesToModels = {
      ADMIN: "Admin",
      SUPER_ADMIN: "Admin",
      ADMIN_STAFF: "Staff",
      STAFF: "Staff",
      CUSTOMER: "Customer",
    };

    for (const [role, model] of Object.entries(rolesToModels)) {
      operations.push({
        updateMany: {
          filter: { actorRole: role, actorModel: { $exists: false } },
          update: { $set: { actorModel: model } },
        },
      });
    }

    const result = await ActivityLog.bulkWrite(operations);

    console.log("✅ Backfill completed successfully.");
    console.log(`   - Matched: ${result.matchedCount}`);
    console.log(`   - Modified: ${result.modifiedCount}`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Backfill failed:", err);
    process.exit(1);
  }
};

run();