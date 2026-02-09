import mongoose from "mongoose";
import Customer from "../models/Customer/customer.model.js";
import { generateReferralCode } from "../utils/referralCode.js";
import dotenv from "dotenv";

dotenv.config();

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  const customers = await Customer.find({
    $or: [
      { "referral.code": { $exists: false } },
      { "referral.code": null }
    ]
  });

  console.log(`Found ${customers.length} customers without referral code`);

  for (const customer of customers) {
    const code = await generateReferralCode(customer.firstName);

    customer.referral = {
      code,
      referredCount: 0
    };

    await customer.save();
    console.log(`Generated ${code} for ${customer._id}`);
  }

  console.log("✅ Referral backfill completed");
  process.exit(0);
})();
