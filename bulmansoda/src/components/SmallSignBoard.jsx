import whiteSign from '../assets/new-white-sign.svg';
import redSign from '../assets/new-red-sign.svg';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import DeleteConfirmModal from './DeleteConfirmModal';

/**
 * props
 * - viewMode: "individual" | "group"
 * - subMode : "default" | "input" | "adjust" | "community"
 * - text / message: 표시할 문구
 * - onOpenLarge: group/default에서 클릭 시 호출(Community 진입 등)
 * - onDelete   : individual/default에서 삭제 확정 시 호출(핀 제거 등)
 */
export default function SmallSignBoard({
  viewMode = 'individual',
  subMode = 'default',
  text,
  message,
  onOpenLarge,
  onDelete,
}) {
  const [showDelete, setShowDelete] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const boardRef = useRef(null);

  const isIndividual = viewMode === 'individual';
  const isAdjusting = isIndividual && subMode === 'adjust';
  const canToggleDelete = isIndividual && subMode === 'default' && !isAdjusting;

  const displayText =
    (typeof text === 'string' && text) ||
    (typeof message === 'string' && message) ||
    '교통사고 삼거리 진입불가';

  const handleClick = () => {
    if (isAdjusting) return; // 조정 중에는 동작 없음

    if (isIndividual) {
      if (subMode === 'default') setShowDelete((prev) => !prev);
    } else {
      if (subMode === 'default') onOpenLarge?.(); // 커뮤니티 페이지 전환 등
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

  // 바깥 클릭 시 삭제 토글 닫기 (모달 열려있으면 무시)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showConfirm) return;
      if (boardRef.current && !boardRef.current.contains(e.target)) {
        setShowDelete(false);
      }
    };
    document.addEventListener('pointerdown', handleClickOutside);
    return () => document.removeEventListener('pointerdown', handleClickOutside);
  }, [showConfirm]);

  // 모드 변경 시 삭제 토글 닫기
  useEffect(() => {
    setShowDelete(false);
  }, [viewMode, subMode]);

  if (isDeleted) return null;

  // ✅ 항상 지도 오버레이 기준(앵커 배치)으로 사용
  const wrapperClass = `
    relative z-20
    w-[180px]
    sm:w-[200px]
    md:w-[300px] 
    lg:w-[400px] 
    xl:w-[500px] 
    p-0.5 cursor-pointer
  `;

  const adjustingRing = isAdjusting ? 'ring-2 ring-red-400 ring-offset-2 animate-pulse' : '';

  return (
    <>
      <div ref={boardRef} onClick={handleClick} className={`${wrapperClass} ${adjustingRing}`}>
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
              className={`
                ${isIndividual ? 'text-black text-center' : 'text-white text-left'}
                text-[15px] sm:text-xl md:text-2xl font-extrabold
                leading-tight px-0.5 
                whitespace-pre-wrap break-words [text-wrap:balance]
                max-w-[95%] max-h-[95%] overflow-hidden
              `}
              title={displayText}
            >
              {displayText}
            </span>
          )}
        </div>
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
        bg-[#F00000] hover:bg-[#d00000] active:bg-[#a00000]
        text-white text-xs sm:text-sm md:text-base font-semibold
        rounded px-3 py-1 focus:outline-none 
      "
    >
      삭제
    </button>
  );
}