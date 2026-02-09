import mongoose from "mongoose";
import ActivityLog from "../src/models/ActivityLog/activityLog.model.js";
import User from "../src/models/User/user.model.js"; // adjust path

const MONGO_URI = "mongodb://localhost:27017/your_db_name";

(async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("DB connected");

    const logs = await ActivityLog.find({
      actorName: { $exists: false },
    });

    console.log(`Found ${logs.length} logs without actorName`);

    for (const log of logs) {
      const user = await User.findById(log.actorId);
      if (user) {
        log.actorName = user.name;
        await log.save();
        console.log(`Updated log ${log._id}`);
      }
    }

    console.log("Backfill completed");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
