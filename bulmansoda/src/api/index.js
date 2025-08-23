import axios from "axios";

// 1) axios 인스턴스 생성
const api = axios.create({
  // 로컬에서는 vite proxy (/api), 배포에서는 Vercel 환경변수 값 사용
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: { "Content-Type": "application/json" },
});

// 2) (선택) 요청 인터셉터
// 필요할 때만 활성화하세요. 예: 항상 userId 붙여야 할 경우
// api.interceptors.request.use((config) => {
//   const dummyUserId = Number(import.meta.env.VITE_DUMMY_UID) || 1;
//   if (config.method === "get") {
//     config.params = { ...(config.params || {}), userId: dummyUserId };
//   } else if (config.data && typeof config.data === "object") {
//     config.data.userId = dummyUserId;
//   }
//   return config;
// });

// 3) export 해서 다른 파일에서 사용
export default api;
