import { Map, MapMarker } from "react-kakao-maps-sdk";

export default function KakaoMap() {
  const center = { lat: 37.5665, lng: 126.9780 };
  const level = 4;
  return (
    <Map
      center={center}
      style={{ width: "100%", height: "100%" }}
      level={level}>
      {/* <MapMarker position={center} /> */}
    </Map>
  );
}
