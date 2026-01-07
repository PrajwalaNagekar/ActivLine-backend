import dotenv from "dotenv";
dotenv.config();
const { SMS_AUTH_KEY, SMS_SENDERID, SMS_BASE_URL } = process.env;

export { SMS_AUTH_KEY, SMS_SENDERID, SMS_BASE_URL };