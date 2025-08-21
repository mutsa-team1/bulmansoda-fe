import { useRef, useState } from "react";
import { CustomOverlayMap, Map, MapMarker } from "react-kakao-maps-sdk";
import SearchBar from "../components/SearchBar";
import SmallSignBoard from "../components/SmallSignBoard";
import LargeSignBoard from "../components/LargeSignBoard";
import TrafficButton from "../components/TrafficButton";
import InputSignBoard from "../components/InputSignBoard";


// mode: "default" | "input" | "adjust"
export default function MapPage() {
  const [center, setCenter] = useState({ lat: 37.5665, lng: 126.9780 });
  const [level, setLevel] = useState(4);
  const [showLarge, setShowLarge] = useState(false);

  const [mode, setMode] = useState("default"); // "default" | "input" | "adjust"
  const [pinPos, setPinPos] = useState(null); // 최종 확정된 위치
  const [inputText, setInputText] = useState(""); // 팻말 내용

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

  // 지도 생성
  const handleMapCreate = (map) => {
    mapRef.current = map;
    setLevel(map.getLevel());

    window.kakao.maps.event.addListener(map, "zoom_changed", () => {
      setLevel(map.getLevel());
    });

    // 조정 모드일 때만 중심 좌표를 state에 동기화 
    window.kakao.maps.event.addListener(map, "center_changed", () => {
      if (mode === "adjust") {
        const c = map.getCenter();
        setCenter({ lat: c.getLat(), lng: c.getLng() });
      }
    });
  };

  // 입력 완료 시 → adjust 모드로 전환
  const handleInputComplete = (text) => {
    setInputText(text);
    setMode("adjust");
  };

  // 조정 완료 시 → 확정된 위치 좌표로 저장하고 default 복귀
  const handleAdjustComplete = () => {
    setPinPos(center); // 지도 중심 좌표를 최종 저장
    setMode("default");
  };

  return (
    <div className="relative w-full h-[100dvh]">

      {/* 검색창 컴포넌트 */}
      <SearchBar ref={inputRef} onSearch={onSearch} />
      {/* 레벨 배지: 검색창 우측 하단(바깥) */}
      <div className="absolute top-3 left-3 right-3 z-20 h-14 pointer-events-none">
        <div
          className="absolute -bottom-11 right-3
                bg-amber-300/95 px-3 py-1.5 rounded-lg shadow-md 
                text-gray-600 text-sm font-bold"
        >
          현재 레벨: {level}
        </div>
      </div>

      {/* 카카오 지도 */}
      <Map
        center={center} level={level}
        style={{ width: "100%", height: "100%" }}
        onCreate={handleMapCreate} // 지도 객체를 가져오는 콜백 
      >
        <MapMarker position={center} />

        {/* 확정된 SmallSignBoard (기본 모드에서만 표시) */}
        {pinPos && mode === "default" && (
          <CustomOverlayMap position={pinPos} xAnchor={0.5} yAnchor={1} zIndex={5}>
            {/* SmallSignBoard가 텍스트 prop을 지원한다면 아래 message(또는 text)로 전달 */}
            <SmallSignBoard
              asPin
              level={level}
              onOpenLarge={() => setShowLarge(true)}
              message={inputText}
              text={inputText}
            />
          </CustomOverlayMap>
        )}

        {/* 조정 모드: 지도 중심에 미리보기(지도 이동으로 위치 맞춤) */}
        {mode === "adjust" && (
          <CustomOverlayMap position={center} xAnchor={0.5} yAnchor={1} zIndex={6}>
            <SmallSignBoard
              asPin
              level={level}
              onOpenLarge={() => { }}
              message={inputText}
              text={inputText}
            />
          </CustomOverlayMap>
        )}

      </Map>
      {/* 입력 모달 */}
      {mode === "input" && (
        <InputSignBoard
          onSubmit={handleInputComplete}
          onCancel={() => setMode("default")}
        />
      )}

      {/* 조정 모드 하단 확정 버튼 */}
      {mode === "adjust" && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20">
          <button
            onClick={handleAdjustComplete}
            className="px-6 py-2 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white rounded-xl shadow-md"
          >
            위치 확정
          </button>
        </div>
      )}

      {/* 상세 보기 패널 */}
      {showLarge && <LargeSignBoard onClose={() => setShowLarge(false)} />}

      {/* 하단 신고 버튼: 기본 모드에서만 노출 */}
      {mode === "default" && (
        <TrafficButton
          onClick={() => {
            // 필요하면 확대 조건 강제: if (level > 3) setLevel(3);
            setMode("input");
          }}
        />
      )}
    </div>
  );
}
