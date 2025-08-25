import { useEffect, useRef, useState } from "react";
import { Map, MapMarker, CustomOverlayMap } from "react-kakao-maps-sdk";

import { fetchCenterMarkers, fetchMarkers } from "../api/map";
import { createMarker, deleteMarker } from "../api/marker";

import IndividualPinsLayer from "../features/map/IndividualPinsLayer";
import GroupMarkersLayer from "../features/map/GroupMarkersLayer";
import HUD from "../features/map/HUD";
import CommunityPanel from "../features/map/CommunityPanel";
import useGeolocation from "../hooks/useGeolocation";

// import currentIcon from "../assets/current-pos.svg";
import pinIcon from "../assets/pin.svg";

export default function MapPage() {
  const dummy_id = Number(import.meta.env.VITE_DUMMY_UID);

  // 지도 상태
  const [center, setCenter] = useState({
    lat: 37.46810567643863,
    lng: 127.03924802821535,
  });
  const [level, setLevel] = useState(3);
  const viewMode = level < 4 ? "individual" : "group";

  // 모드: default → pending(좌표선택) → input(텍스트작성) → adjust(등록)
  const [subMode, setSubMode] = useState("default");
  const [pendingPos, setPendingPos] = useState(null);

  // 서버 동기화 데이터
  const [pins, setPins] = useState([]);
  const [centerMarkers, setCenterMarkers] = useState([]);

  // 상태
  const [inputText, setInputText] = useState("");
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const inputRef = useRef(null);
  const mapRef = useRef(null);

  // 현재 위치
  const { pos, error: geoError } = useGeolocation();
  const initializedRef = useRef(false);

  useEffect(() => {
    if (pos) {
      setCenter({ lat: pos.lat, lng: pos.lng });
      if (!initializedRef.current) {
        setLevel(3);
        initializedRef.current = true;
      }
    }
  }, [pos]);

  useEffect(() => {
    if (geoError) console.warn("위치 불러오기 실패:", geoError?.message);
  }, [geoError]);

  // viewMode 전환 시 모드 정리
  useEffect(() => {
    if (viewMode === "group" && ["pending", "input", "adjust"].includes(subMode)) {
      setSubMode("default");
      setPendingPos(null);
      setInputText("");
    }
    if (viewMode === "individual" && subMode === "community") {
      setSubMode("default");
    }
  }, [viewMode, subMode]);

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

  // Input 제출 → adjust 전환
  const handleInputComplete = (text) => {
    setInputText(text);
    if (pendingPos) {
      setCenter(pendingPos); // adjust 시작 시 center를 선택 좌표로 이동
    }
    setSubMode("adjust");
  };

  // adjust 완료 → 서버 저장
  const handleAdjustComplete = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const targetPos = subMode === "adjust" ? center : pendingPos;
      if (!targetPos) {
        setError("핀 위치가 지정되지 않았어요.");
        return;
      }
      const markerId = await createMarker({
        latitude: targetPos.lat,
        longitude: targetPos.lng,
        userId: dummy_id,
        content: inputText,
      });
      setPins((prev) => [
        ...prev,
        {
          markerId,
          userId: dummy_id,
          latitude: targetPos.lat,
          longitude: targetPos.lng,
          content: inputText,
        },
      ]);
      setInputText("");
      setPendingPos(null);
      setSubMode("default");
    } catch (e) {
      console.error("마커 등록 실패:", e);
      setError("마커 등록에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  // 마커 삭제
  const removePin = async (markerId) => {
    try {
      const ok = await deleteMarker(markerId);
      if (ok) {
        setPins((prev) => prev.filter((p) => p.markerId !== markerId));
      } else {
        // setError("마커 삭제 실패!");
      }
    } catch (e) {
      console.error("❌ 마커 삭제 실패:", e);
      setError("마커 삭제 실패!");
    }
  };

  // 커뮤니티
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

  // 맵 이벤트 바인딩
  const handleMapCreate = (map) => {
    mapRef.current = map;
    setLevel(map.getLevel());

    window.kakao.maps.event.addListener(map, "zoom_changed", () => {
      setLevel(map.getLevel());
    });
    window.kakao.maps.event.addListener(map, "center_changed", () => {
      const c = map.getCenter();
      setCenter({ lat: c.getLat(), lng: c.getLng() });
    });
  };

  return (
    <div className="relative w-full h-[100dvh]">
      {/* pending 안내 */}
      {subMode === "pending" && (
        <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center">
          <div className="bg-black/65 text-white rounded-xl px-4 py-3 shadow-lg text-sm">
            지도를 탭해 위치를 선택하세요
          </div>
        </div>
      )}

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
        onOpenInput={() => {
          setSubMode("pending");
          setPendingPos(null);
          setInputText("");
        }}
        onCancelInput={() => {
          setSubMode("default");
          setPendingPos(null);
          setInputText("");
        }}
        onSubmitInput={handleInputComplete}
        onAdjustConfirm={handleAdjustComplete}
      />

      {/* 지도 */}
      <Map
        center={center}
        level={level}
        style={{ width: "100%", height: "100%" }}
        onCreate={handleMapCreate}
        onClick={(_t, mouseEvent) => {
          if (subMode === "pending") {
            const latlng = mouseEvent.latLng;
            const next = { lat: latlng.getLat(), lng: latlng.getLng() };
            setPendingPos(next);
            setSubMode("input");
          }
        }}
      >
        {/* 현재 위치 마커 */}
        {/* <MapMarker
          zIndex={1}
          position={center}
          image={{
            src: currentIcon,
            size: { width: 48, height: 48 },
            options: { offset: { x: 24, y: 48 } },
          }}
        /> */}

        {/* 선택한 핀 */}
        {(subMode === "adjust" || pendingPos) && (
          <>
            {/* <CustomOverlayMap

              position={subMode === "adjust" ? center : pendingPos}
              xAnchor={0.5}
              yAnchor={1.15}
              zIndex={6}
            >
              <div className="px-2 py-1 rounded-md border bg-white shadow text-[11px]">
                {subMode === "adjust"
                  ? `${center.lat.toFixed(5)}, ${center.lng.toFixed(5)}`
                  : `${pendingPos?.lat.toFixed(5)}, ${pendingPos?.lng.toFixed(5)}`}
              </div>
            </CustomOverlayMap> */}
            <MapMarker
              position={subMode === "adjust" ? center : pendingPos}
              image={{
                src: pinIcon,
                size: { width: 40, height: 40 },
                options: { offset: { x: 20, y: 40 } },
              }}
              zIndex={6}
            />
          </>
        )}


        {/* 기존 마커 레이어 */}
        {viewMode === "individual" ? (
          <IndividualPinsLayer
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
            viewMode={viewMode}
            subMode={subMode}
            centers={centerMarkers}
            dummyId={dummy_id}
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
