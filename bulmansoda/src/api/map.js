import api from ".";

// 마커 목록 조회 (GET) 
export const fetchMarkers = async ({ minLat, maxLat, minLng, maxLng }) => {
  const res = await api.get("/api/map/markers", {
    params: { minLat, maxLat, minLng, maxLng },
  });
  return res.data;
};

// 대표 마커 목록 조회 (GET) 
export const fetchCenterMarkers = async ({ minLat, maxLat, minLng, maxLng }) => {
  const res = await api.get("/api/map/centerMarkers", {
    params: { minLat, maxLat, minLng, maxLng },
  });
  return res.data;
};

// 추후 필요에 따라 DELETE 추가 구현 
// 모든 마커, 대표마커 삭제 /api/map/refresh
// 해결된 마커, 대표마커 삭제 /api/map/fixed