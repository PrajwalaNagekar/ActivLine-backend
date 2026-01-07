import axios from "axios";
import {
    SMS_AUTH_KEY,
    SMS_SENDERID,
    SMS_BASE_URL,
} from "../config/index.js";

const sendSMS = async (
    mobileNumber,
    message,
    templateId = "1707175101642561256"
) => {
    try {
        if (!mobileNumber || !message) {
            throw new Error("Mobile number and message are required");
        }

        if (!SMS_AUTH_KEY || !SMS_SENDERID) {
            throw new Error("SMS credentials missing in environment variables");
        }

        const payload = {
            message,
            senderId: SMS_SENDERID,
            number: mobileNumber,
            templateId,
        };

        const response = await axios.post(
            SMS_BASE_URL,
            payload,
            {
                headers: {
                    "Content-Type": "application/json",
                    APIKEY: SMS_AUTH_KEY,
                },
            }
        );

        console.log("📨 SMS sent:", response.data);
        return response.data;
    } catch (error) {
        console.error(
            "❌ SMS Error:",
            error.response?.data || error.message
        );
        throw error;
    }
};

export default sendSMS;
