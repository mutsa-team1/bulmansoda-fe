import { useEffect, useRef, useState } from "react";
import { CustomOverlayMap, Map, MapMarker } from "react-kakao-maps-sdk";
import SearchBar from "../components/SearchBar";
import SmallSignBoard from "../components/SmallSignBoard";
import TrafficButton from "../components/TrafficButton";
import InputSignBoard from "../components/InputSignBoard";

// Individual 모드(레벨1~3) -> "default(하얀색, 삭제기능있음)", "input" , "adjust" 모드로 나뉨 
// Group 모드 (레벨 4 이상) -> "default(빨간색, 팻말 클릭 시 CommunirtPage 화면으로", "community" 모드로 나뉨

// 최종 모드 정리 
// viewMode: "individual" | "group"
// subMode: 
// "individual" -> "default" | "input" | "adjust"
// "group"      -> "default" | "community"

export default function MapPage() {
  const [center, setCenter] = useState({ lat: 37.5665, lng: 126.9780 });
  const [level, setLevel] = useState(3);

  // const [showLarge, setShowLarge] = useState(false);
  const [subMode, setSubMode] = useState("default"); // individual: default|input|adjust, group: default|community
  const [pinPos, setPinPos] = useState(null); // 최종 확정된 위치
  const [inputText, setInputText] = useState(""); // 팻말 텍스트 

  const inputRef = useRef(null);
  const mapRef = useRef(null); // 지도 객체 보관 

  // level에 따라 상위 모드 결정 
  const viewMode = level < 4 ? "individual" : "group";

  // 최신 subMode / viewMode를 이벤트 리스너에서 참조하기 위한 ref
  const subModeRef = useRef(subMode);
  const viewModeRef = useRef(viewMode);
  useEffect(() => { subModeRef.current = subMode; }, [subMode]);
  useEffect(() => { viewModeRef.current = viewMode; }, [viewMode]);

  // viewMode 전환 시 subMode를 일관성 있게 정리
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

  // 조정 완료 시 → 확정된 위치 좌표로 저장하고 default 복귀
  const handleAdjustComplete = () => {
    setPinPos(center); // 지도 중심 좌표를 최종 저장
    setSubMode("default");
  };

  // group 모드에서 커뮤니티 열기
  const openCommunity = () => {
    setSubMode("community");
  };

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
          여기에 커뮤니티 리스트 / 상세를 렌더링하세요. (라우팅으로 대체 가능)
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

        {/* === Individual 모드 렌더링 === */}
        {viewMode === "individual" && (
          <>
            {/* 확정된 팻말 (default일 때만 클릭/삭제 등 적용) */}
            {pinPos && subMode === "default" && (
              <CustomOverlayMap position={pinPos} xAnchor={0.5} yAnchor={1} zIndex={5}>
                <SmallSignBoard
                  asPin
                  viewMode="individual"
                  subMode="default"
                  text={inputText}
                  onDelete={() => {
                    setPinPos(null);
                    setInputText("");
                  }}
                />
              </CustomOverlayMap>
            )}

            {/* 위치 조정 중 → 지도 중심에 미리보기 */}
            {subMode === "adjust" && (
              <CustomOverlayMap position={center} xAnchor={0.5} yAnchor={1} zIndex={6}>
                <SmallSignBoard
                  viewMode="individual"
                  subMode="adjust"
                  isAdjusting
                  text={inputText}
                />
              </CustomOverlayMap>
            )}
          </>
        )}

        {/* === Group 모드 렌더링 === */}
        {viewMode === "group" && (
          <>
            {/* 그룹 모드의 기본: 빨간 팻말, 클릭 시 커뮤니티 열기 */}
            {pinPos && subMode === "default" && (
              <CustomOverlayMap position={pinPos} xAnchor={0.5} yAnchor={1} zIndex={5}>
                <SmallSignBoard
                  viewMode="group"
                  subMode="default"
                  text={inputText}
                  onOpenLarge={openCommunity} // 클릭 → community 모드
                />
              </CustomOverlayMap>
            )}
          </>
        )}
      </Map>

      {/* === Individual 모드 전용 오버레이들 === */}
      {viewMode === "individual" && subMode === "input" && (
        <InputSignBoard
          onSubmit={handleInputComplete}
          onCancel={() => setSubMode("default")}
        />
      )}

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

      {/* === Group 모드 전용 오버레이 === */}
      {viewMode === "group" && subMode === "community" && (
        <CommunityPanel onClose={() => setSubMode("default")} />
      )}

      {/* 하단 신고 버튼: Individual 모드의 default에서만 노출 */}
      {viewMode === "individual" && subMode === "default" && (
        <TrafficButton onClick={() => setSubMode("input")} />
      )}
    </div>
  );
}
