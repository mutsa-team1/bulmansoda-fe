import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  // baseURL: "api/",
  headers: { "Content-Type": "application/json" },
  // timeout: 10000,
});

export default api;
