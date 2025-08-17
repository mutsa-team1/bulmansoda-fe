// src/pages/MapPage.jsx
import { useEffect, useRef, useState } from "react";
import { Map, CustomOverlayMap } from "react-kakao-maps-sdk";

const PINS = [
  { lat: 37.5665, lng: 126.9780, lines: ["#교통정체;", "#출근길;"] },       // 서울
  { lat: 36.3504, lng: 127.3845, lines: ["#미세먼지;", "#보행환경;"] },     // 대전
  { lat: 35.1796, lng: 129.0756, lines: ["#교통정체;", "#관광편의;"] },    // 부산
  { lat: 35.1595, lng: 126.8526, lines: ["#물가;", "#주거조건;"] },        // 광주
  { lat: 35.8714, lng: 128.6014, lines: ["#범죄사건;", "#보행환경;"] },    // 대구
  { lat: 33.4996, lng: 126.5312, lines: ["#물가;", "#주거조건;"] },        // 제주
];

export default function MapPage() {
  const [center, setCenter] = useState({ lat: 36.5, lng: 127.9 });
  const [level, setLevel] = useState(12); // 숫자 클수록 멀리
  const inputRef = useRef(null);

  // 간단 검색(지오코더로 이동)
  useEffect(() => {
    if (!window.kakao?.maps?.services) return;
    // nothing
  }, []);

  const onSearch = () => {
    const q = inputRef.current?.value?.trim();
    if (!q || !window.kakao?.maps?.services) return;
    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.addressSearch(q, (res, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const { y, x } = res[0];
        setCenter({ lat: parseFloat(y), lng: parseFloat(x) });
        setLevel(5);
      }
    });
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      {/* 상단 검색바 */}
      <div className="topbar">
        <button className="iconbtn" aria-label="menu">☰</button>
        <input
          ref={inputRef}
          className="search"
          placeholder="혜화동"
          onKeyDown={(e) => e.key === "Enter" && onSearch()}
        />
        <button className="iconbtn" onClick={onSearch} aria-label="search">🔍</button>
      </div>

      {/* 카카오 지도 */}
      <Map
        center={center}
        level={level}
        style={{ width: "100%", height: "100%" }}
      >
        {PINS.map((p, idx) => (
          <CustomOverlayMap key={idx} position={{ lat: p.lat, lng: p.lng }}>
            <div className="bubble">
              {p.lines.map((t, i) => (
                <div key={i} className="tag">{t}</div>
              ))}
              <span className="tail" />
            </div>
          </CustomOverlayMap>
        ))}
      </Map>

      {/* 페이지 전용 스타일 */}
      <style>{`
        .topbar {
          position: absolute;
          top: 12px; left: 12px; right: 12px;
          display: flex; align-items: center; gap: 8px;
          background: #fff; border-radius: 12px; padding: 8px 10px;
          box-shadow: 0 6px 18px rgba(0,0,0,0.15);
          z-index: 10;
        }
        .iconbtn {
          background: transparent; border: none; font-size: 20px; line-height: 1;
          width: 28px; height: 28px; cursor: pointer;
        }
        .search {
          flex: 1; border: none; outline: none; font-size: 16px;
        }

        .bubble {
          position: relative;
          background: #fff;
          border: 2px solid #ef4444;  /* red-500 */
          border-radius: 12px;
          padding: 8px 10px;
          box-shadow: 0 8px 22px rgba(0,0,0,0.18);
          transform: translateY(-8px);
          white-space: nowrap;
        }
        .bubble .tag {
          font-weight: 700;
          color: #ef4444;
          font-size: 14px;
          line-height: 1.1;
        }
        .bubble .tail {
          position: absolute;
          left: 18px;
          bottom: -8px;
          width: 12px; height: 12px;
          background: #fff;
          border-left: 2px solid #ef4444;
          border-bottom: 2px solid #ef4444;
          transform: rotate(45deg);
          content: "";
          display: block;
        }
      `}</style>
    </div>
  );
}
