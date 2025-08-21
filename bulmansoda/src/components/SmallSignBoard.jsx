import whiteSign from '../assets/whitesign.svg';
import redSign from '../assets/redsign.svg';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export default function SmallSignBoard({
  level,
  onOpenLarge,
  asPin = false,
  text,
  message,
  isAdjusting = false,
  onDelete,
}) {
  const [showDelete, setShowDelete] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const isUnderFour = level < 4;
  const boardRef = useRef(null);

  const displayText =
    (typeof text === 'string' && text) ||
    (typeof message === 'string' && message) ||
    '교통사고 삼거리 진입불가';

  const handleClick = () => {
    if (isAdjusting) return; // 조정 중에는 클릭 무시
    if (isUnderFour) setShowDelete((prev) => !prev);
    else onOpenLarge?.();
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation(); // ✅ 버블링 방지
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    setShowConfirm(false);
    setIsDeleted(true);
    onDelete?.(); // 상위에 알림(예: pinPos 초기화)
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setShowDelete(false);
  };

  // 바깥 클릭 시 삭제 토글 닫기 (모달 열려있으면 무시)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showConfirm) return; // ✅ 모달 열려있으면 무시
      if (boardRef.current && !boardRef.current.contains(e.target)) {
        setShowDelete(false);
      }
    };
    document.addEventListener('pointerdown', handleClickOutside);
    return () => document.removeEventListener('pointerdown', handleClickOutside);
  }, [showConfirm]);

  // level 변경 시 삭제 토글 닫기
  useEffect(() => {
    setShowDelete(false);
  }, [level]);

  if (isDeleted) return null;

  const wrapperClass = asPin
    ? `
      relative z-20
      w-[85.393px] h-[62.625px]
      sm:w-[200px] sm:h-[150px]
      md:w-[300px] md:h-[220px]
      lg:w-[400px] lg:h-[300px]
      xl:w-[500px] xl:h-[375px]
      p-0.5 cursor-pointer
    `
    : `
      absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
      z-20
      w-[85.393px] h-[62.625px]
      sm:w-[200px] sm:h-[150px]
      md:w-[300px] md:h-[220px]
      lg:w-[400px] lg:h-[300px]
      xl:w-[500px] xl:h-[375px]
      p-0.5 cursor-pointer
    `;

  const adjustingRing = isAdjusting ? 'ring-2 ring-red-400 ring-offset-2 animate-pulse' : '';

  return (
    <>
      <div ref={boardRef} onClick={handleClick} className={`${wrapperClass} ${adjustingRing}`}>
        <img
          src={isUnderFour ? whiteSign : redSign}
          alt="작은 팻말"
          className="w-full h-full object-contain select-none pointer-events-none"
          draggable={false}
        />

        <div className="absolute inset-0 flex items-center justify-center p-1 px-1.5 pb-3">
          {showDelete && isUnderFour && !isAdjusting ? (
            <DeleteButton onClick={handleDeleteClick} />
          ) : (
            <span
              className={`
                ${isUnderFour ? 'text-black' : 'text-white'}
                text-[10px] sm:text-xl md:text-2xl font-extrabold 
                rounded-lg text-center mx-1 leading-snug break-keep
                line-clamp-2
              `}
              title={displayText}
            >
              {displayText}
            </span>
          )}
        </div>
      </div>

      {/* ✅ 포털로 최상단에 모달 렌더 */}
      {showConfirm &&
        createPortal(
          <DeleteConfirmModal onConfirm={confirmDelete} onCancel={cancelDelete} />,
          document.body
        )}
    </>
  );
}

function DeleteButton({ onClick }) {
  // wrapper의 onClick이 먼저 실행되지 않도록 버튼 자체에서도 버블링 차단
  const handleBtnClick = (e) => {
    e.stopPropagation(); // ✅ 이중 안전장치
    onClick?.(e);
  };
  return (
    <button
      type="button"
      onClick={handleBtnClick}
      className="
        bg-[#F00000] hover:bg-[#d00000] active:bg-[#a00000]
        text-white text-xs sm:text-sm md:text-base font-semibold
        rounded px-3 py-1 focus:outline-none 
      "
    >
      삭제
    </button>
  );
}

function DeleteConfirmModal({ onConfirm, onCancel }) {
  // 모달 내부 클릭은 배경 닫힘과 분리
  const stop = (e) => e.stopPropagation();
  return (
    <div
      onClick={onCancel}
      className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center px-4"
    >
      <div
        onClick={stop}
        className="
          bg-white rounded-lg shadow-lg p-6 
          w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl
          text-center border-2 border-gray-950
        "
        role="dialog"
        aria-modal="true"
      >
        <p className="text-gray-700 font-bold mb-4 text-sm sm:text-base md:text-lg">
          정말 삭제하시겠습니까?
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onCancel}
            className="
              bg-gray-100 hover:bg-gray-300 active:bg-gray-500
              text-gray-950 text-xs sm:text-sm md:text-base font-semibold
              rounded px-3 sm:px-4 py-1.5 sm:py-2
              focus:outline-none shadow-md
            "
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="
              bg-[#F00000] hover:bg-[#d00000] active:bg-[#a00000]
              text-white text-xs sm:text-sm md:text-base font-semibold
              rounded px-3 sm:px-4 py-1.5 sm:py-2
              focus:outline-none shadow-lg
            "
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}
