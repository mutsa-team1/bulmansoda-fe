import api from ".";


// 마커 생성 (POST)
export const createMarker = async ({ latitude, longitude, userId, content }) => {
  const res = await api.post("/api/marker/create", {
    latitude,
    longitude,
    userId,
    content,
  });
  return res.data; // 서버는 생성된 id 숫자만 반환
};

// 마커 목록 조회 (GET) 
export const fetchMarkers = async ({ minLat, maxLat, minLng, maxLng }) => {
  const res = await api.get("/api/map/markers", {
    params: { minLat, maxLat, minLng, maxLng },
  });
  return res.data;
};
