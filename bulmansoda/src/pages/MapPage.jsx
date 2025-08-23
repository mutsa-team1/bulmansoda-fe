import { useEffect, useRef, useState } from "react";
import { CustomOverlayMap, Map, MapMarker } from "react-kakao-maps-sdk";
import SearchBar from "../components/SearchBar";
import SmallSignBoard from "../components/SmallSignBoard";
import TrafficButton from "../components/TrafficButton";
import InputSignBoard from "../components/InputSignBoard";
import BottomSheet from "../components/BottomSheet";
import CommunityThread from "../components/CommunityThread";

import LargeSignBoard from "../components/LargeSignBoard";

import { createMarker, deleteMarker } from "../api/marker";
import { fetchCenterMarkers, fetchMarkers } from "../api/map";

export default function MapPage() {
  const dummy_id = Number(import.meta.env.VITE_DUMMY_UID);


  const [center, setCenter] = useState({
    lat: 37.46810567643863,
    lng: 127.03924802821535,
  }); // 양재 aT 센터
  const [level, setLevel] = useState(3);

  const viewMode = level < 4 ? "individual" : "group";
  const [subMode, setSubMode] = useState("default"); // individual: default|input|adjust, group: default|community

  // Individual 전용 핀
  const [pins, setPins] = useState([]); // 서버와 동기화 
  const [inputText, setInputText] = useState("");

  // centerMarkers 서버와 동기화 
  const [centerMarkers, setCenterMarkers] = useState([]);

  // Group 선택된 센터
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [selectedBoard, setSelectedBoard] = useState(null);

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
        setLevel(2); // individual로 확대
      }
    });
  };

  // 최신 모드 참조용 (리스너에서 활용)
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

    // adjust일 때만 중심 동기화
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

  // 데이터 불러오기 함수 분리
  const loadMarkers = async () => {
    const bounds = {
      minLat: 33.0,
      maxLat: 39.0,
      minLng: 124.0,
      maxLng: 132.0,
    };
    try {
      const markers = await fetchMarkers(bounds);
      setPins(markers);

      const centers = await fetchCenterMarkers(bounds);
      setCenterMarkers(centers);
    } catch (e) {
      console.error("마커 불러오기 실패:", e);
    }
  };

  // 최초 1회 + viewMode 바뀔 때마다
  useEffect(() => {
    loadMarkers();
  }, [viewMode]);


  // adjust 위치 확정 → 서버에 저장 (POST)
  const handleAdjustComplete = async () => {
    try {
      const markerId = await createMarker({
        latitude: center.lat,
        longitude: center.lng,
        userId: dummy_id,          // MVP에서는 더미 userId
        content: inputText,
      });

      // 응답 받은 id로 상태 업데이트
      setPins((prev) => [
        ...prev,
        {
          markerId,
          userId: dummy_id,  // 현재는 더미
          latitude: center.lat,
          longitude: center.lng,
          content: inputText,
        },
      ]);

      setInputText("");
      setSubMode("default");
    } catch (error) {
      console.error("마커 등록 실패:", error);
      alert("마커 등록에 실패했습니다.");
    }
  };

  // 마커 삭제
  const removePin = async (markerId) => {
    const ok = await deleteMarker(markerId);
    if (ok) {
      setPins((prev) => prev.filter((p) => p.markerId !== markerId));
    } else {
      alert("마커 삭제 실패!");
    }
  };

  // Group: 커뮤니티 오픈(바텀시트 + LargeSignBoard)
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

  // 바텀시트 열림 여부는 subMode로 파생
  const sheetOpen = viewMode === "group" && subMode === "community";

  return (
    <div className="relative w-full h-[100dvh]">
      {/* 검색창 */}
      <SearchBar ref={inputRef} onSearch={onSearch} />

      {/* 상태 배지 */}
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
        <MapMarker position={center} />

        {/* Individual/default: 확정 핀 */}
        {viewMode === "individual" &&
          subMode === "default" &&
          pins.map((p) => (
            <CustomOverlayMap
              key={p.markerId}
              position={{ lat: p.latitude, lng: p.longitude }}
              xAnchor={0.5}
              yAnchor={1}
              zIndex={5}
            >
              <SmallSignBoard
                viewMode="individual"
                subMode="default"
                text={p.content}
                // 삭제 버튼은 userId(더미; 1) 비교 후 조건부로 노출 가능
                onDelete={p.userId === dummy_id ? () => removePin(p.markerId) : undefined}
              />
            </CustomOverlayMap>
          ))}

        {/* Group/default: 서버에서 가져온 centerMarkers */}
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


        {/* Individual/adjust: 지도 중심 미리보기 */}
        {viewMode === "individual" && subMode === "adjust" && (
          <CustomOverlayMap position={center} xAnchor={0.5} yAnchor={1} zIndex={6}>
            <SmallSignBoard viewMode="individual" subMode="adjust" text={inputText} />
          </CustomOverlayMap>
        )}
      </Map>

      {/* 조정 가이드 십자선 */}
      {viewMode === "individual" && subMode === "adjust" && (
        <div className="pointer-events-none absolute inset-0 z-20">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-px h-full bg-black/20"></div>
          <div className="absolute top-1/2 left-0 -translate-y-1/2 h-px w-full bg-black/20"></div>
        </div>
      )}

      {/* 입력 모달 */}
      {viewMode === "individual" && subMode === "input" && (
        <InputSignBoard
          onSubmit={handleInputComplete}
          onCancel={() => setSubMode("default")}
        />
      )}

      {/* 조정 완료 버튼 */}
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

      {/* community 모드: LargeSignBoard + BottomSheet */}
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
                  {selectedCenter.latitude.toFixed(5)}, {selectedCenter.longitude.toFixed(5)}
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedCenter.keywords.map((k, i) => (
                    <span key={i} className="rounded-full border px-2 py-0.5 text-xs">
                      #{k}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <CommunityThread userId={dummy_id}
              centerMarkerId={selectedCenter.centerMarkerId} />
          </BottomSheet>
        </>
      )}
    </div>
  );
}
