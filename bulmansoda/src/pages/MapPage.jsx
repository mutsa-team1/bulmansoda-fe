import { useEffect,  useRef, useState } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";

import { fetchCenterMarkers, fetchMarkers } from "../api/map";
import { createMarker, deleteMarker } from "../api/marker";

import IndividualPinsLayer from "../features/map/IndividualPinsLayer";
import GroupMarkersLayer from "../features/map/GroupMarkersLayer";
import HUD from "../features/map/HUD";
import CommunityPanel from "../features/map/CommunityPanel";
import useGeolocation from "../hooks/useGeolocation";

import pinIcon from "../assets/pin.svg";
import LoginPage from "./LoginPage"; // ✅ 로그인 페이지 import

const shiftPositionByPixels = (map, lat, lng, dyPx) => {
  if (!map || !window.kakao?.maps) return { lat, lng };
  const proj = map.getProjection();
  const point = proj.pointFromCoords(new window.kakao.maps.LatLng(lat, lng));
  const shifted = new window.kakao.maps.Point(point.x, point.y + dyPx);
  const newLatLng = proj.coordsFromPoint(shifted);
  return { lat: newLatLng.getLat(), lng: newLatLng.getLng() };
};

export default function MapPage({ userId, onLoginSuccess }) {
  console.log(userId);

  // 지도 상태
  const [center, setCenter] = useState({
    lat: 37.46810567643863,
    lng: 127.03924802821535,
  });
  const [level, setLevel] = useState(3);
  const viewMode = level < 4 ? "individual" : "group";

  // 모드
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

  const toggleMode = () => {
    if (!mapRef.current) return;
    const targetLevel = viewMode === "individual" ? 7 : 3;
    try {
      mapRef.current.setLevel(targetLevel, { animate: true });
    } catch {
      mapRef.current.setLevel(targetLevel);
    }
  };

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
      setCenter(pendingPos);
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
        userId: userId, // ✅ props로 받은 userId 사용
        content: inputText,
      });
      setPins((prev) => [
        ...prev,
        {
          markerId,
          userId: userId,
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

  // ✅ adjust 취소 핸들러
  const handleCancelAdjust = () => {
    setSubMode("default");
    setPendingPos(null);
    setInputText("");
  };
  // ✅ 로그인 안 된 경우 → LoginPage 렌더링
  if (!userId) {
    return <LoginPage onSuccess={onLoginSuccess} />;
  }

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
        saving={saving}
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
        onCancelAdjust={handleCancelAdjust}
        onToggleMode={toggleMode}
      />

      {/* 지도 */}
      <Map
        center={center}
        level={level}
        style={{ width: "100%", height: "100%" }}
        onCreate={handleMapCreate}
        onClick={(_t, mouseEvent) => {
          if (subMode === "pending" && mapRef.current) {
            const latlng = mouseEvent.latLng;
            const next = { lat: latlng.getLat(), lng: latlng.getLng() };
            setPendingPos(next);

            const mapDiv = mapRef.current.getNode();
            const quarterHeight = mapDiv.offsetHeight / 4;
            const shifted = shiftPositionByPixels(
              mapRef.current,
              next.lat,
              next.lng,
              -quarterHeight
            );
            setCenter(shifted);

            setSubMode("input");
          }
        }}
      >

        {pendingPos && subMode !== "adjust" && (
          <MapMarker
            position={pendingPos}
            image={{
              src: pinIcon,
              size: { width: 40, height: 40 },
              options: { offset: { x: 20, y: 40 } },
            }}
            zIndex={6}
          />
        )}

        {/* 기존 마커 레이어 */}
        {viewMode === "individual" ? (
          <IndividualPinsLayer
            viewMode={viewMode}
            subMode={subMode}
            pins={pins}
            center={center}
            inputText={inputText}
            dummyId={userId}
            onDelete={removePin}
            onCancelAdjust={handleCancelAdjust}
          />
        ) : (
          <GroupMarkersLayer
            viewMode={viewMode}
            subMode={subMode}
            centers={centerMarkers}
            dummyId={userId}
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
        dummyId={userId}
      />
    </div>
  );
}
