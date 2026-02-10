import admin from "firebase-admin";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (!admin.apps.length) {
  const serviceAccountPath = path.join(__dirname, "../../firebase-admin.json");

  if (!fs.existsSync(serviceAccountPath)) {
    console.error("❌ Firebase Admin initialization failed: Service account file not found.");
    console.error(`   The server expected to find the file at: "${serviceAccountPath}"`);
    console.error("   Please ensure 'firebase-admin.json' is in the project root directory.");
    process.exit(1);
  }

  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("✅ Firebase Admin initialized successfully");
}

export const firebaseAdmin = admin;
