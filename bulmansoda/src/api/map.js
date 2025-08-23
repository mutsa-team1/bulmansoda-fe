import api from ".";

// 마커 목록 조회 (GET) 
export const fetchMarkers = async ({ minLat, maxLat, minLng, maxLng }) => {
  const res = await api.get("/api/map/markers", {
    params: { minLat, maxLat, minLng, maxLng },
  });
  return res.data;
};