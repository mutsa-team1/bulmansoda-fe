import { useEffect, useRef, useState } from "react";

export default function useGeolocation(
  options = { enableHighAccuracy: true, timeout: 8000, maximumAge: 60_000 }
) {
  const [pos, setPos] = useState(null);       // {lat, lng, accuracy}
  const [error, setError] = useState(null);
  const askedRef = useRef(false);             // 권한 요청 여러 번 방지

  useEffect(() => {
    if (!navigator.geolocation) {
      setError(new Error("이 브라우저는 Geolocation을 지원하지 않아요."));
      return;
    }
    if (askedRef.current) return;
    askedRef.current = true;

    navigator.geolocation.getCurrentPosition(
      p => setPos({
        lat: p.coords.latitude,
        lng: p.coords.longitude,
        accuracy: p.coords.accuracy
      }),
      err => setError(err),
      options
    );
  }, [options]);

  return { pos, error };
}
