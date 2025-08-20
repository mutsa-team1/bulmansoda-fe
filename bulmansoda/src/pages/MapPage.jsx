import { useRef, useState } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import SearchBar from "../components/SearchBar";
import TrafficButton from "../components/TrafficButton";
import SmallSignBoard from "../components/SmallSignBoard";

// level 추적 기능 구현 필요 

export default function MapPage() {
  const [center, setCenter] = useState({ lat: 37.5665, lng: 126.9780 });
  const [level, setLevel] = useState(4);
  const inputRef = useRef(null);

  const onSearch = () => {
    const q = inputRef.current?.value?.trim();
    if (!q || !window.kakao?.maps?.services) return;

    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.addressSearch(q, (res, status) => {
      if (status === window.kakao.maps.services.Status.OK && res.length) {
        const { y, x } = res[0];
        setCenter({ lat: parseFloat(y), lng: parseFloat(x) });
        setLevel(1); // 최대 스케일로 렌더링, 모든 핀 표시 예정 
      }
    });
  };

  return (
    <div className="relative w-full h-[100dvh]">
      {/* 검색창 컴포넌트 */}
      <SearchBar ref={inputRef} onSearch={onSearch} />
      
      {/* 카카오 지도 */}
      <Map center={center} level={level}
        style={{ width: "100%", height: "100%" }}>
        <MapMarker position={center} />
        {/* <SmallSignBoard level={level}/> */}
      </Map>
      
    </div>
  );
}
