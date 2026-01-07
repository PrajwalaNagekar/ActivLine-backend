import Admin from "../models/admin.model.js";

const seedAdmin = async () => {
    try {
        // IMPORTANT: DO NOT connect mongoose again
        // connection is already open in connectDB()

        const NAMES = process.env.ADMIN_NAMES?.split(",");
        const EMAILS = process.env.ADMIN_EMAILS?.split(",");
        const PHONES = process.env.ADMIN_PHONES?.split(",");
        const PASSWORDS = process.env.ADMIN_PASSWORDS?.split(",");
        const TYPES = process.env.ADMIN_TYPES?.split(",");

        for (let i = 0; i < EMAILS.length; i++) {
            const email = EMAILS[i];

            const exists = await Admin.findOne({ email });
            if (exists) {
                console.log(`⚠️ Admin already exists: ${email}`);
                continue;
            }

            await Admin.create({
                name: NAMES[i],
                email,
                phone: PHONES[i],
                password: PASSWORDS[i],
                userType: TYPES[i] || "Admin",
                createdBy: null,
            });

            console.log(`✅ Admin created: ${email}`);
        }
    } catch (error) {
        console.error("❌ Admin seeding failed:", error);
    }
};

export default seedAdmin;
