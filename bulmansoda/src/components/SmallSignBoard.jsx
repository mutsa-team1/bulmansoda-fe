import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import DeleteConfirmModal from "./DeleteConfirmModal";

// SVG viewBox는 유지하고, 외부 div 크기로 전체 크기를 조절합니다.
const SpeechBubbleBackground = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 200 76"
    fill="none"
    className="absolute inset-0 w-full h-full"
  >
    <g filter="url(#filter0_d_284_279)">
      <path
        d="M188 28C188 16.9543 179.046 8 168 8H28C16.9543 8 8 16.9543 8 28V40C8 51.0457 16.9543 60 28 60H168C179.046 60 188 51.0457 188 40V28Z"
        fill="#FFFEFE"
      />
    </g>
    <defs>
      <filter
        id="filter0_d_284_279"
        x="0"
        y="0"
        width="200"
        height="80"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dx="2" dy="2" />
        <feGaussianBlur stdDeviation="5" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.607843 0 0 0 0 0.607843 0 0 0 0 0.607843 0 0 0 0.3 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_284_279"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_284_279"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);

const InfoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    viewBox="0 0 17 17"
    fill="none"
  >
    <path
      d="M8.5 2.125C12.0208 2.125 14.875 4.97918 14.875 8.5C14.875 12.0208 12.0208 14.875 8.5 14.875C4.97918 14.875 2.125 12.0208 2.125 8.5C2.125 4.97918 4.97918 2.125 8.5 2.125ZM7.4375 7.79199C7.04641 7.79199 6.72967 8.10895 6.72949 8.5C6.72967 8.89105 7.04641 9.20898 7.4375 9.20898H7.79199V11.334C7.79234 11.7249 8.10902 12.042 8.5 12.042H9.91699C10.3078 12.0418 10.6246 11.7248 10.625 11.334C10.625 10.9429 10.308 10.6252 9.91699 10.625H9.20801V8.5C9.20783 8.10895 8.89109 7.79199 8.5 7.79199H7.4375ZM8.5 4.95898C8.1088 4.95899 7.79199 5.27579 7.79199 5.66699C7.79217 6.05804 8.10891 6.375 8.5 6.375H8.50684C8.89793 6.375 9.21564 6.05804 9.21582 5.66699C9.21582 5.27579 8.89804 4.95898 8.50684 4.95898H8.5Z"
      fill="#FF4949"
    />
  </svg>
);

export default function SmallSignBoard({
  viewMode = "individual",
  subMode = "default",
  text,
  onOpenLarge,
  onDelete,
  onCancel,
}) {
  const [showDelete, setShowDelete] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const boardRef = useRef(null);

  const canToggleDelete =
    viewMode === "individual" && subMode === "default" && onDelete;

  const handleClick = () => {
    if (subMode === "adjust") return;
    if (subMode !== "default") return;
    if (viewMode === "individual") {
      if (onDelete) setShowDelete((prev) => !prev);
    } else {
      onOpenLarge?.();
    }
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    setShowConfirm(false);
    onDelete?.();
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setShowDelete(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        !showConfirm &&
        boardRef.current &&
        !boardRef.current.contains(e.target)
      ) {
        setShowDelete(false);
      }
    };
    document.addEventListener("pointerdown", handleClickOutside);
    return () => document.removeEventListener("pointerdown", handleClickOutside);
  }, [showConfirm]);

  useEffect(() => {
    setShowDelete(false);
  }, [viewMode, subMode]);

  return (
    <>
      <div
        ref={boardRef}
        onClick={handleClick}
        // ✅ 전체적인 크기와 위치를 키웠습니다.
        className="relative w-[220px] h-[85px] cursor-pointer bottom-[50px] right-[1px]"
      >
        <SpeechBubbleBackground />
        <div className="absolute inset-0 flex items-center justify-center p-3">
          {canToggleDelete && showDelete ? (
            <button
              type="button"
              onClick={handleDeleteClick}
              className="bg-[#F00000] hover:bg-[#d00000] text-white font-semibold rounded px-4 py-1.5"
            >
              삭제
            </button>
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full text-center">
              <div className="flex items-center gap-1.5 mb-1">
                <InfoIcon />
                {/* ✅ 글자 크기를 키웠습니다. */}
                <span className="text-[#FF4949] text-sm font-bold">
                  도로 상황
                </span>
              </div>
              <p className="text-black text-base font-bold leading-tight break-words">
                {text}
              </p>
            </div>
          )}
        </div>

        {subMode === "adjust" && onCancel && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onCancel();
            }}
            className="absolute top-3.5 right-5.5 w-5 h-5 grid place-items-center rounded-full bg-black/50 text-white text-xs hover:bg-black/70"
          >
            ×
          </button>
        )}
      </div>

      {showConfirm &&
        createPortal(
          <DeleteConfirmModal onConfirm={confirmDelete} onCancel={cancelDelete} />,
          document.body
        )}
    </>
  );
}