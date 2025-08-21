import { useCallback, useEffect, useRef, useState } from "react";

/**
 * props
 * - open, onClose, snapPoints, initialSnap, showBackdrop, className
 * - snapTolerance?: number  // 스냅 흡착 허용 거리(px). 기본 24
 * - closeDragDelta?: number // 아래로 끌어 닫히는 최소 드래그(px). 기본 80
 */
export default function BottomSheet({
  open,
  onClose,
  snapPoints = [140, "50dvh", "85dvh"],
  initialSnap = 1,
  showBackdrop = false,
  className = "",
  children,
  snapTolerance = 24,
  closeDragDelta = 80,
}) {
  const sheetRef = useRef(null);
  const startYRef = useRef(0);
  const startHRef = useRef(0);
  const draggingRef = useRef(false);

  const [snapPx, setSnapPx] = useState([]);
  const [height, setHeight] = useState(0);

  const supportsPointer =
    typeof window !== "undefined" && "onpointerdown" in window;

  const getVh = () =>
    (window.visualViewport && window.visualViewport.height) ||
    window.innerHeight;

  const toPx = useCallback((v) => {
    if (typeof v === "number") return v;
    const m = String(v).trim();
    if (m.endsWith("dvh") || m.endsWith("vh")) {
      const ratio = parseFloat(m) / 100;
      return Math.round(getVh() * ratio);
    }
    if (m.endsWith("px")) return parseFloat(m);
    const n = parseFloat(m);
    return isNaN(n) ? 300 : n;
  }, []);

  const clampH = (h) => Math.max(60, Math.min(getVh(), h));

  const recalcSnap = useCallback(() => {
    const arr = snapPoints.map(toPx).sort((a, b) => a - b);
    setSnapPx(arr);
    const initIdx = Math.min(Math.max(0, initialSnap), arr.length - 1);
    setHeight(arr[initIdx] || 300);
  }, [snapPoints, initialSnap, toPx]);

  useEffect(() => {
    if (!open) return;
    recalcSnap();
    const onResize = () => recalcSnap();
    window.addEventListener("resize", onResize);
    window.visualViewport?.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.visualViewport?.removeEventListener("resize", onResize);
    };
  }, [open, recalcSnap]);

  const addDragListeners = useCallback(() => {
    if (supportsPointer) {
      window.addEventListener("pointermove", onDragMove, { passive: false });
      window.addEventListener("pointerup", onDragEnd);
      window.addEventListener("pointercancel", onDragEnd);
    } else {
      window.addEventListener("touchmove", onDragMove, { passive: false });
      window.addEventListener("touchend", onDragEnd);
      window.addEventListener("touchcancel", onDragEnd);
    }
  }, [supportsPointer]);

  const removeDragListeners = useCallback(() => {
    if (supportsPointer) {
      window.removeEventListener("pointermove", onDragMove);
      window.removeEventListener("pointerup", onDragEnd);
      window.removeEventListener("pointercancel", onDragEnd);
    } else {
      window.removeEventListener("touchmove", onDragMove);
      window.removeEventListener("touchend", onDragEnd);
      window.removeEventListener("touchcancel", onDragEnd);
    }
  }, [supportsPointer]);

  const onDragStart = (e) => {
    draggingRef.current = true;
    const y =
      ("clientY" in e && e.clientY) ||
      (e.touches && e.touches[0]?.clientY) ||
      0;
    startYRef.current = y;
    startHRef.current = height;
    document.documentElement.style.overscrollBehaviorY = "none";
    document.body.style.overscrollBehaviorY = "none";
    document.body.style.userSelect = "none";
    addDragListeners();
  };

  const onDragMove = (e) => {
    if (!draggingRef.current) return;
    const y =
      ("clientY" in e && e.clientY) ||
      (e.touches && e.touches[0]?.clientY) ||
      0;
    const dy = startYRef.current - y; // 위로 +, 아래로 -
    const next = clampH(startHRef.current + dy);
    setHeight(next);
    e.preventDefault?.();
  };

  const onDragEnd = () => {
    draggingRef.current = false;
    document.body.style.userSelect = "";
    document.documentElement.style.overscrollBehaviorY = "";
    document.body.style.overscrollBehaviorY = "";
    removeDragListeners();

    // 아래로 끌어내린 거리(닫힘 판단)
    const dragDelta = height - startHRef.current; // 아래로 당기면 음수
    if (dragDelta < -closeDragDelta) {
      onClose?.();
      return;
    }

    // 가장 가까운 스냅, 단 snapTolerance 이내일 때만 흡착
    let bestIdx = -1;
    let bestDist = Infinity;
    snapPx.forEach((sp, i) => {
      const d = Math.abs(sp - height);
      if (d < bestDist) {
        bestDist = d;
        bestIdx = i;
      }
    });
    if (bestIdx >= 0 && bestDist <= snapTolerance) {
      setHeight(snapPx[bestIdx]);
    } else {
      setHeight(clampH(height)); // 미세 위치 유지
    }
  };

  useEffect(() => {
    return () => {
      draggingRef.current = false;
      document.body.style.userSelect = "";
      document.documentElement.style.overscrollBehaviorY = "";
      document.body.style.overscrollBehaviorY = "";
      removeDragListeners();
    };
  }, [removeDragListeners]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] pointer-events-none">
      {showBackdrop && (
        <div
          className="absolute inset-0 bg-black/30 pointer-events-auto"
          onClick={onClose}
        />
      )}

      <div
        ref={sheetRef}
        className={`absolute inset-x-0 bottom-0 bg-white border-t shadow-2xl rounded-t-2xl pointer-events-auto ${className}`}
        style={{
          height,
          transition: draggingRef.current ? "none" : "height 220ms ease",
          paddingBottom: "calc(env(safe-area-inset-bottom) + 8px)",
          overscrollBehaviorY: "none", // 시트 자체 bounce 억제
          willChange: "height",
        }}
      >
        {/* 드래그 핸들 */}
        <div
          onPointerDown={supportsPointer ? onDragStart : undefined}
          onTouchStart={!supportsPointer ? onDragStart : undefined}
          className="mx-auto mt-2 mb-2 h-1.5 w-12 rounded-full bg-gray-300 active:bg-gray-400"
          style={{ touchAction: "none" }}
        />

        {/* 내용 */}
        <div className="h-[calc(100%-16px)] overflow-auto overscroll-contain px-3 pb-2">
          {children}
        </div>
      </div>
    </div>
  );
}
