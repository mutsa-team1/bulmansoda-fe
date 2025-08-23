import api from ".";


// 마커 목록 조회 (GET) 
export const fetchMarkers = async ({ minLat, maxLat, minLng, maxLng }) => {
  const res = await api.get("/api/map/markers", {
    params: { minLat, maxLat, minLng, maxLng },
  });
  return res.data;
};

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

// marker 삭제 API 호출
export const deleteMarker = async (markerId) => {
  try {
    await api.delete("/api/marker/delete", {
      data: markerId, // DELETE 메서드에서도 data 넣을 수 있음
    });
    return true;
  } catch (err) {
    console.error("마커 삭제 실패:", err);
    return false;
  }
};


