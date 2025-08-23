import axios from "axios";

const api = axios.create({
  baseURL: "/api",           // ✅ 배포/로컬 모두 /api로 고정
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

export default api;
