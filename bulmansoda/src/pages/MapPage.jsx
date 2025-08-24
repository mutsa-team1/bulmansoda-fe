import { useEffect, useRef, useState } from "react";
import { CustomOverlayMap, Map, MapMarker } from "react-kakao-maps-sdk";
import SearchBar from "../components/SearchBar";
import SmallSignBoard from "../components/SmallSignBoard";
import TrafficButton from "../components/TrafficButton";
import InputSignBoard from "../components/InputSignBoard";
import BottomSheet from "../components/BottomSheet";
import CommunityThread from "../components/CommunityThread";
import LargeSignBoard from "../components/LargeSignBoard";
import AdjustGuide from "../components/AdjustGuide";

import { createMarker, deleteMarker } from "../api/marker";
import { fetchCenterMarkers, fetchMarkers } from "../api/map";

export default function MapPage() {
  const dummy_id = Number(import.meta.env.VITE_DUMMY_UID);

  const [center, setCenter] = useState({
    lat: 37.46810567643863,
    lng: 127.03924802821535,
  }); // 기본 위치 (양재 aT 센터)
  const [level, setLevel] = useState(3);

  const viewMode = level < 4 ? "individual" : "group";
  const [subMode, setSubMode] = useState("default");

  // 서버 동기화 데이터
  const [pins, setPins] = useState([]);
  const [centerMarkers, setCenterMarkers] = useState([]);

  // 상태 관리
  const [inputText, setInputText] = useState("");
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [error, setError] = useState(null); // ✅ 에러 상태 추가

  const inputRef = useRef(null);
  const mapRef = useRef(null);

  // viewMode 전환 시 subMode 정리
  useEffect(() => {
    if (viewMode === "group" && (subMode === "input" || subMode === "adjust")) {
      setSubMode("default");
    }
    if (viewMode === "individual" && subMode === "community") {
      setSubMode("default");
    }
  }, [viewMode, subMode]);

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

  // 최신 모드 참조용
  const subModeRef = useRef(subMode);
  const viewModeRef = useRef(viewMode);
  useEffect(() => {
    subModeRef.current = subMode;
  }, [subMode]);
  useEffect(() => {
    viewModeRef.current = viewMode;
  }, [viewMode]);

  // 지도 생성
  const handleMapCreate = (map) => {
    mapRef.current = map;
    setLevel(map.getLevel());

    window.kakao.maps.event.addListener(map, "zoom_changed", () => {
      setLevel(map.getLevel());
    });

    window.kakao.maps.event.addListener(map, "center_changed", () => {
      if (
        subModeRef.current === "adjust" &&
        viewModeRef.current === "individual"
      ) {
        const c = map.getCenter();
        setCenter({ lat: c.getLat(), lng: c.getLng() });
      }
    });
  };

  // 입력 완료 → adjust
  const handleInputComplete = (text) => {
    setInputText(text);
    setSubMode("adjust");
  };

  // 데이터 불러오기
  const loadMarkers = async () => {
    const bounds = {
      minLat: 33.0,
      maxLat: 39.0,
      minLng: 124.0,
      maxLng: 132.0,
    };
    try {
      setError(null);
      const markers = await fetchMarkers(bounds);
      setPins(Array.isArray(markers) ? markers : []); // ✅ 안전 처리

      const centers = await fetchCenterMarkers(bounds);
      setCenterMarkers(Array.isArray(centers) ? centers : []); // ✅ 안전 처리
    } catch (e) {
      console.error("❌ 마커 불러오기 실패:", e);

      setPins([]); // ✅ fallback 값
      setCenterMarkers([]); // ✅ fallback 값
    }
  };
  // 최초 + viewMode 변경 시 호출
  useEffect(() => {
    loadMarkers();
  }, [viewMode]);

  // adjust → 서버 저장
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
    } catch (error) {
      console.error("마커 등록 실패:", error);
      setError("서버에서 데이터를 불러오지 못했습니다.");
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

  // Community
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

  const sheetOpen = viewMode === "group" && subMode === "community";

  return (
    <div className="relative w-full h-[100dvh]">
      {/* 검색창 */}
      <SearchBar ref={inputRef} onSearch={onSearch} />

      {/* 상태/에러 배지 */}
      <div className="absolute top-3 left-3 right-3 z-20 h-14 pointer-events-none">
        <div className="absolute -bottom-11 right-3 bg-amber-300/95 px-3 py-1.5 rounded-lg shadow-md text-gray-800 text-xs font-bold">
          레벨: {level} · viewMode: {viewMode} · subMode: {subMode}
          {viewMode === "individual" && <> · 핀: {pins.length}</>}
        </div>
      </div>
      {/* ✅ 위치 조정 안내 메시지 */}
      {viewMode === "individual" && subMode === "input" && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20">
          <AdjustGuide />
        </div>
      )}

      {/* ✅ 에러 메시지 UI */}
      {error && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
          {error}
        </div>
      )}

      {/* 지도 */}
      <Map
        center={center}
        level={level}
        style={{ width: "100%", height: "100%" }}
        onCreate={handleMapCreate}
      >
        <MapMarker position={center} />

        {/* Individual/default pins */}
        {viewMode === "individual" &&
          subMode === "default" &&
          pins.map((p) => (
            // ✅ 이 부분을 수정합니다.
            // key를 각각의 컴포넌트에 부여해야 합니다.
            <>
              <MapMarker
                key={`marker-${p.markerId}`}
                position={{ lat: p.latitude, lng: p.longitude }}
              />
              <CustomOverlayMap
                key={`overlay-${p.markerId}`}
                position={{ lat: p.latitude, lng: p.longitude }}
                yAnchor={1}
                xAnchor={0.5}
                zIndex={10}
              >
                <SmallSignBoard
                  viewMode="individual"
                  subMode="default"
                  text={p.content}
                  onDelete={
                    p.userId === dummy_id
                      ? () => removePin(p.markerId)
                      : undefined
                  }
                />
              </CustomOverlayMap>
            </>
          ))}

        {/* Group/default markers */}
        {viewMode === "group" &&
          subMode === "default" &&
          centerMarkers.map((gc) => (
            <CustomOverlayMap
              key={gc.centerMarkerId}
              position={{ lat: gc.latitude, lng: gc.longitude }}
              xAnchor={0.5}
              yAnchor={1}
              zIndex={5}
            >
              <SmallSignBoard
                viewMode="group"
                subMode="default"
                text={gc.keywords.join(" ")}
                onOpenLarge={() => openCommunity(gc)}
              />
            </CustomOverlayMap>
          ))}

        {/* Adjust preview */}
        {viewMode === "individual" && subMode === "adjust" && (
          <CustomOverlayMap position={center} yAnchor={1} zIndex={10}>
            <SmallSignBoard
              viewMode="individual"
              subMode="adjust"
              text={inputText}
              // ✅ onCancel 함수를 전달합니다.
              onCancel={() => {
                setSubMode("default");
                setInputText(""); // 작성 중이던 텍스트 초기화
              }}
            />
          </CustomOverlayMap>
        )}
      </Map>

      {/* 입력 모달 */}
      {viewMode === "individual" && subMode === "input" && (
        <InputSignBoard
          onSubmit={handleInputComplete}
          onCancel={() => setSubMode("default")}
        />
      )}

      {/* Adjust 완료 버튼 */}
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

      {/* 신고 버튼 */}
      {viewMode === "individual" && subMode === "default" && (
        <TrafficButton onClick={() => setSubMode("input")} />
      )}

      {/* Community 모드 */}
      {subMode === "community" && (
        <>
          {selectedBoard && (
            <LargeSignBoard
              title={selectedBoard.keywords.join(" ")}
              initialLikes={selectedBoard.likes ?? 0}
              userId={dummy_id}
              centerMarkerId={selectedBoard.centerMarkerId}
              onClose={closeCommunity}
            />
          )}
          <BottomSheet
            open={sheetOpen}
            onClose={closeCommunity}
            snapPoints={[140, "45dvh", "85dvh"]}
            initialSnap={1}
            showBackdrop={false}
          >
            {selectedCenter && (
              <div className="mb-3 space-y-2">
                <div className="text-sm text-gray-500">
                  centerId: <b>{selectedCenter.centerMarkerId}</b> ·{" "}
                  {selectedCenter.latitude.toFixed(5)},{" "}
                  {selectedCenter.longitude.toFixed(5)}
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedCenter.keywords.map((k, i) => (
                    <span
                      key={i}
                      className="rounded-full border px-2 py-0.5 text-xs"
                    >
                      #{k}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <CommunityThread
              userId={dummy_id}
              centerMarkerId={selectedCenter.centerMarkerId}
            />
          </BottomSheet>
        </>
      )}
    </div>
  );
}
