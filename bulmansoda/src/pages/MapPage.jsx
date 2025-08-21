import { useRef, useState } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import SearchBar from "../components/SearchBar";
import SmallSignBoard from "../components/SmallSignBoard";
import LargeSignBoard from "../components/LargeSignBoard";

// level 추적 기능 구현 필요 

export default function MapPage() {
  const [center, setCenter] = useState({ lat: 37.5665, lng: 126.9780 });
  const [level, setLevel] = useState(4);
  const [showLarge, setShowLarge] = useState(false);
  const inputRef = useRef(null);
  const mapRef = useRef(null); // 지도 객체 보관 

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

  const handleMapCreate = (map) => {
    mapRef.current = map;
    setLevel(map.getLevel()); // 초기 레벨 동기화 
    // 지도 이동/확대/축소 이벤트에 따라 레벨 업데이트 
    window.kakao.maps.event.addListener(map, "zoom_changed", () => {
      setLevel(map.getLevel());
    });
  };

  return (
    <div className="relative w-full h-[100dvh]">
      {/* 검색창 컴포넌트 */}
      <SearchBar ref={inputRef} onSearch={onSearch} />

      {/* 카카오 지도 */}
      <Map
        center={center} level={level}
        style={{ width: "100%", height: "100%" }}
        onCreate={handleMapCreate} // 지도 객체를 가져오는 콜백 
        >
        <MapMarker position={center} />
        <SmallSignBoard level={level} onOpenLarge={() => setShowLarge(true)} />
      </Map>
      {showLarge && <LargeSignBoard onClose={() => setShowLarge(false)} />}

    </div>
  );
}
