import { useEffect, useState } from "react";

/**
 * 로컬 스토리지에 핀 배열을 저장/불러오는 훅
 * @param {string} key - localStorage key (default: "traffic_pins_v1")
 * @param {Array} initial - 초기값 (기본 [])
 * @returns {[Array, Function]} [pins, setPins]
 */
export default function usePinsStorage(key = "traffic_pins_v1", initial = []) {
  const [pins, setPins] = useState(initial);

  // 최초 1회: load
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) setPins(parsed);
    } catch (e) {
      console.warn("Failed to load pins from storage:", e);
    }
  }, [key]);

  // 변경 시마다: save
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(pins));
    } catch (e) {
      console.warn("Failed to save pins to storage:", e);
    }
  }, [key, pins]);

  return [pins, setPins];
}
