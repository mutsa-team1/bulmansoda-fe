import { useEffect, useRef, useState } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";

import { fetchCenterMarkers, fetchMarkers } from "../api/map";
import { createMarker, deleteMarker } from "../api/marker";

import IndividualPinsLayer from "../features/map/IndividualPinsLayer";
import GroupMarkersLayer from "../features/map/GroupMarkersLayer";
import HUD from "../features/map/HUD";
import CommunityPanel from "../features/map/CommunityPanel";
import useGeolocation from "../hooks/useGeolocation";

import currentIcon from "../assets/current-pos.svg";

export default function MapPage() {
  const dummy_id = Number(import.meta.env.VITE_DUMMY_UID);

  // 지도 상태
  const [center, setCenter] = useState({
    lat: 37.46810567643863,
    lng: 127.03924802821535,
  });
  const [level, setLevel] = useState(3);
  const viewMode = level < 4 ? "individual" : "group";

  // 서브 모드
  const [subMode, setSubMode] = useState("default");

  // 서버 동기화 데이터
  const [pins, setPins] = useState([]);
  const [centerMarkers, setCenterMarkers] = useState([]);

  // 상태
  const [inputText, setInputText] = useState("");
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [error, setError] = useState(null);

  const inputRef = useRef(null);
  const mapRef = useRef(null);

  // ✅ 현재 위치
  const { pos, error: geoError } = useGeolocation();
  const initializedRef = useRef(false);

  useEffect(() => {
    if (pos) {
      setCenter({ lat: pos.lat, lng: pos.lng });
      if (!initializedRef.current) {
        setLevel(3); // 최초 진입 시만 레벨 3으로 세팅
        initializedRef.current = true;
      }
    }
  }, [pos]);

  useEffect(() => {
    if (geoError) console.warn("위치 불러오기 실패:", geoError.message);
  }, [geoError]);

  // viewMode 전환 시 subMode 정리
  useEffect(() => {
    if (viewMode === "group" && ["input", "adjust"].includes(subMode)) {
      setSubMode("default");
    }
    if (viewMode === "individual" && subMode === "community") {
      setSubMode("default");
    }
  }, [viewMode]);

  // 데이터 불러오기
  const loadMarkers = async () => {
    const bounds = { minLat: 33.0, maxLat: 39.0, minLng: 124.0, maxLng: 132.0 };
    try {
      setError(null);
      const markers = await fetchMarkers(bounds);
      setPins(Array.isArray(markers) ? markers : []);
      const centers = await fetchCenterMarkers(bounds);
      setCenterMarkers(Array.isArray(centers) ? centers : []);
    } catch (e) {
      console.error("❌ 마커 불러오기 실패:", e);
      setError("서버에서 데이터를 불러오지 못했습니다.");
      setPins([]);
      setCenterMarkers([]);
    }
  };

  useEffect(() => {
    loadMarkers();
  }, [viewMode]);

  // 검색
  const onSearch = () => {
    const q = inputRef.current?.value?.trim();
    if (!q || !window.kakao?.maps?.services) return;
    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.addressSearch(q, (res, status) => {
      if (status === window.kakao.maps.services.Status.OK && res.length) {
        const { y, x } = res[0];
        setCenter({ lat: parseFloat(y), lng: parseFloat(x) });
        setLevel(2);
      }
    });
  };

  // 입력 완료 -> adjust
  const handleInputComplete = (text) => {
    setInputText(text);
    setSubMode("adjust");
  };

  // adjust 완료 -> 서버 저장
  const handleAdjustComplete = async () => {
    try {
      const markerId = await createMarker({
        latitude: center.lat,
        longitude: center.lng,
        userId: dummy_id,
        content: inputText,
      });
      setPins((prev) => [
        ...prev,
        {
          markerId,
          userId: dummy_id,
          latitude: center.lat,
          longitude: center.lng,
          content: inputText,
        },
      ]);
      setInputText("");
      setSubMode("default");
    } catch (e) {
      console.error("마커 등록 실패:", e);
      setError("마커 등록에 실패했습니다.");
    }
  };

  // 마커 삭제
  const removePin = async (markerId) => {
    try {
      const ok = await deleteMarker(markerId);
      if (ok) {
        setPins((prev) => prev.filter((p) => p.markerId !== markerId));
      } else {
        setError("마커 삭제 실패!");
      }
    } catch (e) {
      console.error("❌ 마커 삭제 실패:", e);
      setError("마커 삭제 실패!");
    }
  };

  // 커뮤니티 모드
  const openCommunity = (centerItem) => {
    setSelectedCenter(centerItem);
    setSelectedBoard(centerItem);
    setSubMode("community");
  };
  const closeCommunity = () => {
    setSelectedCenter(null);
    setSelectedBoard(null);
    setSubMode("default");
  };

  // ✅ 맵 이벤트 바인딩
  const handleMapCreate = (map) => {
    mapRef.current = map;
    setLevel(map.getLevel());

    // ✅ 줌 변경 이벤트
    window.kakao.maps.event.addListener(map, "zoom_changed", () => {
      setLevel(map.getLevel());
    });

    // ✅ 지도 중심 변경 이벤트 (조건 제거 → 항상 갱신)
    window.kakao.maps.event.addListener(map, "center_changed", () => {
      const c = map.getCenter();
      setCenter({ lat: c.getLat(), lng: c.getLng() });
    });
  };

  return (
    <div className="relative w-full h-[100dvh]">
      {/* HUD */}
      <HUD
        inputRef={inputRef}
        onSearch={onSearch}
        level={level}
        viewMode={viewMode}
        subMode={subMode}
        pinsCount={pins.length}
        error={error}
        onClearError={() => setError(null)}
        onOpenInput={() => setSubMode("input")}
        onCancelInput={() => setSubMode("default")}
        onSubmitInput={handleInputComplete}
        onAdjustConfirm={handleAdjustComplete}
      />

      {/* 지도 */}
      <Map
        center={center}
        level={level}
        style={{ width: "100%", height: "100%" }}
        onCreate={handleMapCreate}
      >
        <MapMarker
          zIndex={10}
          image={{
            src: currentIcon,   // ✅ public 폴더나 import한 이미지 경로
            size: { width: 48, height: 48 },
            options: { offset: { x: 24, y: 48 } }, // 중심 좌표 기준 offset
          }} position={center} />

        {viewMode === "individual" ? (
          <IndividualPinsLayer
            zIndex={5}
            viewMode={viewMode}
            subMode={subMode}
            pins={pins}
            center={center}
            inputText={inputText}
            dummyId={dummy_id}
            onDelete={removePin}
          />
        ) : (
          <GroupMarkersLayer
            zIndex={5}
            viewMode={viewMode}
            subMode={subMode}
            centers={centerMarkers}
            onOpenCommunity={openCommunity}
          />
        )}
      </Map>

      {/* 커뮤니티 패널 */}
      <CommunityPanel
        open={subMode === "community"}
        onClose={closeCommunity}
        selectedBoard={selectedBoard}
        selectedCenter={selectedCenter}
        dummyId={dummy_id}
      />
    </div>
  );
}
