// util 함수: 특정 좌표를 화면에서 Y 방향으로 이동시킨 새 좌표 계산
const shiftPositionByPixels = (map, lat, lng, dyPx) => {
  if (!map || !window.kakao?.maps) return { lat, lng };

  const proj = map.getProjection();
  const point = proj.pointFromCoords(new window.kakao.maps.LatLng(lat, lng));
  const shifted = new window.kakao.maps.Point(point.x, point.y + dyPx);
  const newLatLng = proj.coordsFromPoint(shifted);
  return { lat: newLatLng.getLat(), lng: newLatLng.getLng() };
};

export default shiftPositionByPixels; 