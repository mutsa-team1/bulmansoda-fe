
import { Map, MapMarker } from "react-kakao-maps-sdk";

console.log("KEY =", import.meta.env.VITE_KAKAO_MAP_KEY);


export default function KakaoMap() {
  const center = { lat: 37.5665, lng: 126.9780 };
  return (
    <div style={{ width: 402, height: 874 }}>
      <Map center={center} style={{ width: "100%", height: "100%" }} level={12}>
        {/* <MapMarker position={center} /> */}
      </Map>
    </div>
  );
}
