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
<<<<<<< Updated upstream

import { createMarker, deleteMarker } from "../api/marker";
import { fetchCenterMarkers, fetchMarkers } from "../api/map";
=======
import pinIcon from "../assets/pin.svg"; // 위치 조정 핀 아이콘

import { createMarker, deleteMarker } from "../api/marker";
import { fetchCenterMarkers, fetchMarkers } from "../api/map";

// 화면 중앙에 표시될 고정 핀 아이콘 컴포넌트
const CenterPin = () => (
  <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
    <img src={pinIcon} alt="위치 지정 핀" className="w-10 h-10" />
  </div>
);
>>>>>>> Stashed changes

export default function MapPage() {
  const dummy_id = Number(import.meta.env.VITE_DUMMY_UID);

  const [center, setCenter] = useState({
    lat: 37.46810567643863,
    lng: 127.03924802821535,
  }); // 기본 위치 (양재 aT 센터)
  const [level, setLevel] = useState(3);

  const viewMode = level < 4 ? "individual" : "group";
  const [subMode, setSubMode] = useState("default");

  const [pins, setPins] = useState([]);
  const [centerMarkers, setCenterMarkers] = useState([]);

<<<<<<< Updated upstream
  // 상태 관리
  const [inputText, setInputText] = useState("");
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [error, setError] = useState(null); // ✅ 에러 상태 추가
=======
  // ✅ 위치 확정 후 좌표를 저장할 새로운 상태
  const [confirmedPosition, setConfirmedPosition] = useState(null);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [error, setError] = useState(null);
>>>>>>> Stashed changes

  const inputRef = useRef(null);
  const mapRef = useRef(null);

<<<<<<< Updated upstream
  // viewMode 전환 시 subMode 정리
  useEffect(() => {
    if (viewMode === "group" && (subMode === "input" || subMode === "adjust")) {
=======
  useEffect(() => {
    if (viewMode === "group" && (subMode === "adjust" || subMode === "input")) {
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
  // 최신 모드 참조용
=======
>>>>>>> Stashed changes
  const subModeRef = useRef(subMode);
  const viewModeRef = useRef(viewMode);
  useEffect(() => {
    subModeRef.current = subMode;
  }, [subMode]);
  useEffect(() => {
    viewModeRef.current = viewMode;
  }, [viewMode]);
<<<<<<< Updated upstream

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
=======

  const handleMapCreate = (map) => {
    mapRef.current = map;
    setLevel(map.getLevel());

    window.kakao.maps.event.addListener(map, "zoom_changed", () => {
      setLevel(map.getLevel());
    });

    // ✅ 'adjust' 모드일 때 지도가 움직이면 중앙 좌표를 상태에 반영합니다.
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
>>>>>>> Stashed changes

  // ✅ 2단계: 위치 확정
  const handleAdjustComplete = () => {
    setConfirmedPosition(center); // 현재 중앙 좌표를 확정된 위치로 저장
    setSubMode("input"); // 다음 단계(글 쓰기)로 전환
  };

  // ✅ 3단계: 글 작성 완료 및 핀 생성
  const handleCreatePin = async (text) => {
    if (!confirmedPosition) return; // 확정된 위치가 없으면 실행 중지

    // 백엔드 연동 전 임시 로직
    const newPin = {
      markerId: Date.now(),
      userId: dummy_id,
      latitude: confirmedPosition.lat, // 확정된 위치의 위도 사용
      longitude: confirmedPosition.lng, // 확정된 위치의 경도 사용
      content: text,
    };
    setPins((prev) => [...prev, newPin]);

    // 상태 초기화
    setSubMode("default");
    setConfirmedPosition(null);
  };

  const loadMarkers = async () => {
    try {
      setError(null);
      const markers = await fetchMarkers({});
      setPins(Array.isArray(markers) ? markers : []);
      const centers = await fetchCenterMarkers({});
      setCenterMarkers(Array.isArray(centers) ? centers : []);
    } catch (e) {
      console.error("❌ 마커 불러오기 실패:", e);
      setPins([]);
      setCenterMarkers([]);
    }
  };

  useEffect(() => {
    loadMarkers();
  }, [viewMode]);

  const removePin = async (markerId) => {
    try {
      await deleteMarker(markerId);
      setPins((prev) => prev.filter((p) => p.markerId !== markerId));
    } catch (e) {
      console.error("❌ 마커 삭제 실패:", e);
      setError("마커 삭제 실패!");
    }
  };

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
<<<<<<< Updated upstream
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
=======
      <SearchBar ref={inputRef} onSearch={onSearch} />
      <div className="absolute top-3 left-3 right-3 z-20 h-14 pointer-events-none">
        <div className="absolute -bottom-11 right-3 bg-amber-300/95 px-3 py-1.5 rounded-lg shadow-md text-gray-800 text-xs font-bold">
          레벨: {level} · viewMode: {viewMode} · subMode: {subMode}
        </div>
      </div>
      {viewMode === "individual" && subMode === "adjust" && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20">
          <AdjustGuide />
        </div>
      )}
      {error && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
          {error}
        </div>
      )}
>>>>>>> Stashed changes
      <Map
        center={center}
        level={level}
        style={{ width: "100%", height: "100%" }}
        onCreate={handleMapCreate}
      >
<<<<<<< Updated upstream
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
=======
        {viewMode === "individual" &&
          subMode === "default" &&
          pins.map((p) => (
            <>
              
>>>>>>> Stashed changes
              <CustomOverlayMap
                key={`overlay-${p.markerId}`}
                position={{ lat: p.latitude, lng: p.longitude }}
                yAnchor={1}
                xAnchor={0.5}
                zIndex={10}
              >
                <SmallSignBoard
<<<<<<< Updated upstream
                  viewMode="individual"
                  subMode="default"
=======
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream

        {/* Group/default markers */}
=======
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
                subMode="default"
=======
>>>>>>> Stashed changes
                text={gc.keywords.join(" ")}
                onOpenLarge={() => openCommunity(gc)}
              />
            </CustomOverlayMap>
          ))}
<<<<<<< Updated upstream

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
=======
      </Map>

      {/* ✅ 1단계: 알리기 버튼 누르면 'adjust' 모드로 변경 */}
      {viewMode === "individual" && subMode === "default" && (
        <TrafficButton onClick={() => setSubMode("adjust")} />
      )}

      {/* ✅ 2단계: 위치 확정 */}
      {viewMode === "individual" && subMode === "adjust" && (
        <>
          <CenterPin />
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20">
            <button
              onClick={handleAdjustComplete}
              className="px-8 py-3 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-bold rounded-full shadow-lg"
            >
              위치 확정
            </button>
          </div>
        </>
      )}

      {/* ✅ 3단계: 글 쓰기 */}
      {viewMode === "individual" && subMode === "input" && (
        <InputSignBoard
          onSubmit={handleCreatePin}
          onCancel={() => {
            setSubMode("default");
            setConfirmedPosition(null);
          }}
        />
      )}

>>>>>>> Stashed changes
      {subMode === "community" && (
        <>
          {selectedBoard && (
            <LargeSignBoard
              title={selectedBoard.keywords.join(" ")}
<<<<<<< Updated upstream
              initialLikes={selectedBoard.likes ?? 0}
=======
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
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
=======
              <CommunityThread
                userId={dummy_id}
                centerMarkerId={selectedCenter.centerMarkerId}
              />
            )}
>>>>>>> Stashed changes
          </BottomSheet>
        </>
      )}
    </div>
  );
}

