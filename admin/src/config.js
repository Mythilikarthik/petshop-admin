// src/config.js
const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://petshop-admin.onrender.com"
    : "http://localhost:5000";

export default API_BASE_URL;
