// config/external/activline.config.js
export default {
  baseURL: "https://live.activline.in/api/v1",
  timeout: 15000,
  username: process.env.ACTIVLINE_USERNAME,
  password: process.env.ACTIVLINE_PASSWORD,
};
