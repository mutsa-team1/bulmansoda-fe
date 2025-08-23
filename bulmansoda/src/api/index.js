import axios from "axios";

// 1) axios 인스턴스 생성
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080", 
  headers: {
    "Content-Type": "application/json",
  },
});

// 2) 요청 인터셉터 등록
// api.interceptors.request.use((config) => {
//   const dummyUserId = 1; 
//   if (config.method === "get") {
//     config.params = { ...(config.params || {}), userId: dummyUserId };
//   } else if (config.data && typeof config.data === "object") {
//     config.data.userId = dummyUserId;
//   }
//   return config;
// });

// 3) export 해서 다른 파일에서 사용
export default api;
