import axios from "axios";

const username = process.env.ACTIVLINE_USERNAME;
const password = process.env.ACTIVLINE_PASSWORD;

// Basic Auth header
const basicAuth = Buffer
  .from(`${username}:${password}`)
  .toString("base64");

const activlineClient = axios.create({
  baseURL: "https://live.activline.in/api/v1",
  timeout: 15000,
  headers: {
    "Authorization": `Basic ${basicAuth}`,
    "Content-Type": "application/x-www-form-urlencoded",
  },
});

export default activlineClient;
