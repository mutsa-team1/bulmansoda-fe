import api from ".";
import { handleApiError } from "../utils/handleApiError";



// 마커 생성 (POST)
export const createMarker = async ({ latitude, longitude, userId, content }) => {
  try {
    const res = await api.post("/marker/create", {
      latitude,
      longitude,
      userId,
      content,
    });
    return res.data; // 서버는 생성된 id 숫자만 반환
  } catch (error) {
    handleApiError(error, "마커 등록에 실패했습니다.");
    throw error; // 필요 시 상위에서 추가 처리
  }
};

// 마커 삭제 (DELETE)
export const deleteMarker = async (markerId) => {
  try {
    const res = await api.delete("/marker/delete", {
      data: markerId, // 숫자만 보내기
    });
    return res.data ?? true;
  } catch (error) {
    handleApiError(error, "마커 삭제에 실패했습니다.");
    return false; 
  }
};

