import api from ".";
import { handleApiError } from "../utils/handleApiError";

// 유저 생성 API (POST)
export const createUser = async ({ name, phoneNumber }) => {
  try {
    const res = await api.post(
      "/user/create",
      {
        name,
        phoneNumber
      }, // Request Body 명시
      { headers: { "Content-Type": "application/json" } }
    );
    return res.data; // 서버는 생성된 userId 숫자만 반환
  } catch (error) {
    handleApiError(error, "유저 생성에 실패했습니다.");
    throw error;
  }
};

// 유저 삭제 API (DELETE)
export const deleteUser = async (userId) => {
  try {
    const res = await api.delete("/user/delete", {
      data: userId, // 숫자만 Request Body에 전달
    });
    return res.data ?? true; // 서버는 빈 응답을 줄 예정이므로 true 반환
  } catch (error) {
    handleApiError(error, "유저 삭제에 실패했습니다.");
    return false;
  }
};

// 유저 이름 변경 API (PUT)
export const updateUserName = async ({ userId, name }) => {
  try {
    const res = await api.put("/user/name", { userId, name }, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data ?? true; // 서버는 빈 응답이므로 true 반환
  } catch (error) {
    handleApiError(error, "유저 이름 변경에 실패했습니다.");
    return false;
  }
};


// 유저 로그인 (GET)
// Request Body 없음 → 서버가 로그인 처리 후 userId 숫자 반환
export const loginUser = async () => {
  try {
    const res = await api.get("/user/login");
    return res.data; // 예: 1 (유저 id)
  } catch (error) {
    handleApiError(error, "로그인에 실패했습니다.");
    throw error;
  }
};