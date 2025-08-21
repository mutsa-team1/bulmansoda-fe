import { useEffect, useRef, useState } from "react";
import { CustomOverlayMap, Map, MapMarker } from "react-kakao-maps-sdk";
import SearchBar from "../components/SearchBar";
import SmallSignBoard from "../components/SmallSignBoard";
import TrafficButton from "../components/TrafficButton";
import InputSignBoard from "../components/InputSignBoard";
// import useGeolocation from "../hooks/useGeolocation";

// Individual 모드(레벨1~3) -> "default(하얀색, 삭제기능있음)", "input" , "adjust"
// Group 모드 (레벨 4 이상) -> "default(빨간색, 팻말 클릭 시 CommunityPage 화면)", "community"

// 최종 모드 정리
// viewMode: "individual" | "group"
// subMode:
// "individual" -> "default" | "input" | "adjust"
// "group"      -> "default" | "community"

export default function MapPage() {
  const [center, setCenter] = useState({ lat: 37.46810567643863, lng: 127.03924802821535 }); // 양재 aT 센터
  const [level, setLevel] = useState(3);

  const viewMode = level < 4 ? "individual" : "group";
  const [subMode, setSubMode] = useState("default"); // individual: default|input|adjust, group: default|community

  // 여러 개 핀 상태관리 (Individual 전용)
  const [pins, setPins] = useState([]); // [{id, lat, lng, text}]
  const [inputText, setInputText] = useState(""); // 팻말 텍스트

  const inputRef = useRef(null);
  const mapRef = useRef(null);

  // !!!! 현재 위치 받아오기 기능 구현함, 근데 양재 aT 센터 그냥 디폴트로 해 둠 일단 주석처리
  // const { pos } = useGeolocation();
  // // 위치를 받으면 한 번만 중심 이동 (무한 렌더링 방지)
  // useEffect(() => {
  //   if (pos) {
  //     setCenter({ lat: pos.lat, lng: pos.lng });
  //     // setLevel(3);
  //   }
  // }, [pos]);


  // viewMode 전환 안전장치 (subMode 일관성 유지 등)
  useEffect(() => {
    // group으로 바뀌면 input/adjust는 무효 → default
    if (viewMode === "group" && (subMode === "input" || subMode === "adjust")) {
      setSubMode("default");
    }
    // individual로 바뀌면 community는 무효 → default
    if (viewMode === "individual" && subMode === "community") {
      setSubMode("default");
    }
  }, [viewMode]); // level 변화로 viewMode가 달라지면 정리

  // !!!! 로컬 스토리지 load/save !!!! => 이 부분 DB 연결 
  useEffect(() => {
    try {
      const raw = localStorage.getItem("traffic_pins_v1");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setPins(parsed);
      }
    } catch (e) {
      console.warn("Failed to load pins from storage:", e);
    }
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("traffic_pins_v1", JSON.stringify(pins));
    } catch (e) {
      console.warn("Failed to save pins to storage:", e);
    }
  }, [pins]);

  // 장소 검색 기능 (간단 버전)
  const onSearch = () => {
    const q = inputRef.current?.value?.trim();
    if (!q || !window.kakao?.maps?.services) return;

    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.addressSearch(q, (res, status) => {
      if (status === window.kakao.maps.services.Status.OK && res.length) {
        const { y, x } = res[0];
        setCenter({ lat: parseFloat(y), lng: parseFloat(x) });
        setLevel(2); // 확대해서 individual 모드로 이동
      }
    });
  };

  // 최신 subMode / viewMode를 이벤트 리스너에서 참조하기 위한 ref
  const subModeRef = useRef(subMode);
  const viewModeRef = useRef(viewMode);
  useEffect(() => { subModeRef.current = subMode; }, [subMode]);
  useEffect(() => { viewModeRef.current = viewMode; }, [viewMode]);

  // 지도 생성
  const handleMapCreate = (map) => {
    mapRef.current = map;
    setLevel(map.getLevel());

    window.kakao.maps.event.addListener(map, "zoom_changed", () => {
      setLevel(map.getLevel());
    });

    // 조정 모드일 때만 중심 좌표를 state에 동기화
    window.kakao.maps.event.addListener(map, "center_changed", () => {
      if (subModeRef.current === "adjust" && viewModeRef.current === "individual") {
        const c = map.getCenter();
        setCenter({ lat: c.getLat(), lng: c.getLng() });
      }
    });
  };

  // 입력 완료 시 → adjust 모드로 전환
  const handleInputComplete = (text) => {
    setInputText(text);
    setSubMode("adjust");
  };

  // 조정 완료 시 → 확정된 위치 좌표로 새 핀 저장하고 default 복귀
  const handleAdjustComplete = () => {
    const id = (crypto?.randomUUID && crypto.randomUUID()) || `${Date.now()}_${Math.random()}`;
    setPins((prev) => [...prev, { id, lat: center.lat, lng: center.lng, text: inputText }]);
    setInputText("");
    setSubMode("default");
  };

  // 핀 삭제 (Individual 전용)
  const removePin = (id) => {
    setPins((prev) => prev.filter((p) => p.id !== id));
  };

  // group 모드에서 커뮤니티 열기 (현재는 패널만; 추후 라우팅/DB 연동)
  // const openCommunity = () => {
  //   setSubMode("community");
  // };

  // group 모드의 커뮤니티 패널 (간단한 오버레이; 실제 페이지 연결로 교체 가능)
  const CommunityPanel = ({ onClose }) => (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-xl border-2 border-gray-900 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-extrabold text-gray-900">CommunityPage</h2>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-md bg-gray-200 hover:bg-gray-300 active:bg-gray-400 text-gray-900 font-semibold"
          >
            닫기
          </button>
        </div>
        <div className="text-gray-700">
          {/* TODO: 그룹 모드 데이터는 추후 외부 DB 연동 후 여기서 렌더링 */}
          외부 데이터 연동 예정입니다.
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative w-full h-[100dvh]">
      {/* 검색창 */}
      <SearchBar ref={inputRef} onSearch={onSearch} />

      {/* 레벨/모드 배지 */}
      <div className="absolute top-3 left-3 right-3 z-20 h-14 pointer-events-none">
        <div className="absolute -bottom-11 right-3 bg-amber-300/95 px-3 py-1.5 rounded-lg shadow-md text-gray-800 text-xs font-bold">
          레벨: {level} · viewMode: {viewMode} · subMode: {subMode}
          {viewMode === "individual" && <> · 핀: {pins.length}</>}
        </div>
      </div>

      {/* 지도 */}
      <Map
        center={center}
        level={level}
        style={{ width: "100%", height: "100%" }}
        onCreate={handleMapCreate}
      >
        {/* 기준 마커 - 추후 삭제 예정 */}
        <MapMarker position={center} />

        {/* === Individual 모드: 확정된 모든 핀 렌더 === */}
        {viewMode === "individual" && subMode === "default" &&
          pins.map((p) => (
            <CustomOverlayMap
              key={p.id}
              position={{ lat: p.lat, lng: p.lng }}
              xAnchor={0.5}
              yAnchor={1}
              zIndex={5}
            >
              <SmallSignBoard
                viewMode="individual"
                subMode="default"
                text={p.text}
                onDelete={() => removePin(p.id)}
              />
            </CustomOverlayMap>
          ))
        }

        {/* === Group 모드: 로컬 핀 사용하지 않음 (추후 DB 렌더링) === */}
        {viewMode === "group" && subMode === "default" && (
          <>
            {/* TODO: 외부 DB에서 불러온 그룹 데이터로 렌더링 예정 */}
            {/* 예: groupPins.map(... SmallSignBoard viewMode="group" subMode="default" onOpenLarge={openCommunity}) */}
          </>
        )}

        {/* === 위치 조정 미리보기 (지도 중심) — Individual/adjust 전용 === */}
        {viewMode === "individual" && subMode === "adjust" && (
          <CustomOverlayMap position={center} xAnchor={0.5} yAnchor={1} zIndex={6}>
            <SmallSignBoard
              viewMode="individual"
              subMode="adjust"
              text={inputText}
            />
          </CustomOverlayMap>
        )}
      </Map>

      {/* (옵션) 조정 가이드 십자선 */}
      {viewMode === "individual" && subMode === "adjust" && (
        <div className="pointer-events-none absolute inset-0 z-20">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-px h-full bg-black/20"></div>
          <div className="absolute top-1/2 left-0 -translate-y-1/2 h-px w-full bg-black/20"></div>
        </div>
      )}

      {/* 입력 모달 (Individual 전용) */}
      {viewMode === "individual" && subMode === "input" && (
        <InputSignBoard
          onSubmit={handleInputComplete}
          onCancel={() => setSubMode("default")}
        />
      )}

      {/* 조정 완료 버튼 (Individual 전용) */}
      {viewMode === "individual" && subMode === "adjust" && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20">
          <button
            onClick={handleAdjustComplete}
            className="px-6 py-2 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white rounded-xl shadow-md"
          >
            위치 확정
          </button>
        </div>
      )}

      {/* 그룹 모드 커뮤니티 패널 */}
      {viewMode === "group" && subMode === "community" && (
        <CommunityPanel onClose={() => setSubMode("default")} />
      )}

      {/* 하단 신고 버튼: Individual/default 에서만 노출 */}
      {viewMode === "individual" && subMode === "default" && (
        <TrafficButton onClick={() => setSubMode("input")} />
      )}
    </div>
  );
}
