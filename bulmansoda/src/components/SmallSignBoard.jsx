import whiteSign from "../assets/new-white-sign.svg";
import redSign from "../assets/final-red-sign.svg";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { fetchCenterMarkers } from "../api/map";
import { likeCenterMarker } from "../api/centerMarker";
import CenterLikeButton from "./CenterLikeButton"; // ✅ 공감 버튼 컴포넌트

export default function SmallSignBoard({
  viewMode = "individual",
  subMode = "default",
  text,
  message,
  userId,
  centerMarkerId,
  onOpenLarge,
  onDelete,
}) {
  const [showDelete, setShowDelete] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const boardRef = useRef(null);

  const [initialLikes, setInitialLikes] = useState(0); // ✅ 초기 공감 수만 관리

  const isIndividual = viewMode === "individual";
  const isAdjusting = isIndividual && subMode === "adjust";
  const canToggleDelete =
    isIndividual && subMode === "default" && !isAdjusting;

  const displayText =
    (typeof text === "string" && text) ||
    (typeof message === "string" && message) ||
    "교통사고 삼거리 진입불가";

  const handleClick = () => {
    if (isAdjusting) return;
    if (isIndividual) {
      if (subMode === "default") setShowDelete((prev) => !prev);
    } else {
      if (subMode === "default") onOpenLarge?.();
    }
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    setShowConfirm(false);
    setIsDeleted(true);
    onDelete?.();
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setShowDelete(false);
  };

  // ✅ 초기 공감 수 불러오기 (bounds 포함)
  useEffect(() => {
    if (!centerMarkerId) return;
    const loadLikes = async () => {
      try {
        const bounds = {
          minLat: 33.0,
          maxLat: 39.0,
          minLng: 124.0,
          maxLng: 132.0,
        };
        const markers = await fetchCenterMarkers(bounds);

        const target = markers.find(
          (m) => m.centerMarkerId === centerMarkerId
        );

        console.log("🔎 SmallSignBoard fetch result:", markers, "target:", target);

        if (target) {
          setInitialLikes(target.likeCount ?? 0);
        }
      } catch (e) {
        console.error("❌ SmallSignBoard 공감 수 불러오기 실패:", e);
      }
    };
    loadLikes();
  }, [centerMarkerId]);

  if (isDeleted) return null;

  const wrapperClass = `
    relative z-20
    w-[180px]
    sm:w-[200px]
    md:w-[300px] 
    lg:w-[400px] 
    xl:w-[500px] 
    p-0.5 cursor-pointer
  `;

  const adjustingRing = isAdjusting
    ? "ring-2 ring-red-400 ring-offset-2 animate-pulse"
    : "";

  return (
    <>
      <div
        ref={boardRef}
        onClick={handleClick}
        className={`${wrapperClass} ${adjustingRing}`}
      >
        <img
          src={isIndividual ? whiteSign : redSign}
          alt=""
          className="w-full h-full object-contain select-none pointer-events-none"
          draggable={false}
        />

        <div className="absolute inset-0 flex items-center justify-center p-2 px-3 pb-3.5">
          {canToggleDelete && showDelete && onDelete ? (
            <DeleteButton onClick={handleDeleteClick} />
          ) : (
            <span
              className={`${
                isIndividual ? "text-black text-center max-h-[95%]" : "text-white text-left pl-2 pb-12 max-h-[80%]"
              }
                text-[15px] sm:text-xl md:text-2xl font-extrabold
                leading-tight px-0.5 
                whitespace-pre-wrap break-words [text-wrap:balance]
                max-w-[95%] overflow-hidden
              `}
              title={displayText}
            >
              {displayText}
            </span>
          )}
        </div>

        {/* ✅ 그룹 모드에서만 공감 버튼 */}
        {!isIndividual && (
          <div className="absolute bottom-5.5 right-3">
            <CenterLikeButton
              initialLikes={initialLikes}
              onLike={() =>
                likeCenterMarker({ userId, centerMarkerId })
              }
            />
          </div>
        )}
      </div>

      {showConfirm &&
        createPortal(
          <DeleteConfirmModal
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
          />,
          document.body
        )}
    </>
  );
}

function DeleteButton({ onClick }) {
  const handleBtnClick = (e) => {
    e.stopPropagation();
    onClick?.(e);
  };
  return (
    <button
      type="button"
      onClick={handleBtnClick}
      className="
        bg-red-500 hover:bg-red-600 active:bg-red-700
        text-white text-xs sm:text-sm md:text-base font-semibold
        rounded-lg px-4 py-1.5 mb-1 focus:outline-none 
      "
    >
      삭제
    </button>
  );
}
