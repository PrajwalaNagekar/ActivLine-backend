import axios from "axios";
import activlineConfig from "../../config/Jaze_API/Ticket/activline.config.js";

const basicAuth = Buffer
  .from(`${activlineConfig.username}:${activlineConfig.password}`)
  .toString("base64");

const activlineClient = axios.create({
  baseURL: activlineConfig.baseURL,
  timeout: activlineConfig.timeout,
  headers: {
    Authorization: `Basic ${basicAuth}`,
  },
});

export default activlineClient;
