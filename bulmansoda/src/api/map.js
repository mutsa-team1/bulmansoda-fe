import api from ".";
import { handleApiError } from "../utils/handleApiError"; // 아까 만든 공통 유틸

// 마커 목록 조회 (GET)
export const fetchMarkers = async (bounds) => {
  try {
    const res = await api.get("/map/markers", { params: bounds });
    return res.data;
  } catch (error) {
    handleApiError(error, "마커 목록 조회에 실패했습니다.");
    throw error;
  }
};

// 대표 마커 목록 조회 (GET)
export const fetchCenterMarkers = async (bounds) => {
  try {
    const res = await api.get("/map/centerMarkers", { params: bounds });
    return res.data;
  } catch (error) {
    handleApiError(error, "대표마커 목록 조회에 실패했습니다.");
    throw error;
  }
};

// 추후 필요에 따라 DELETE 추가 구현 
// 모든 마커, 대표마커 삭제 /api/map/refresh
// 해결된 마커, 대표마커 삭제 /api/map/fixed