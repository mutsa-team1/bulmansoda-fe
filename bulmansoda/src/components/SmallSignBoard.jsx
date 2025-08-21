import whiteSign from '../assets/whitesign.svg';
import redSign from '../assets/redsign.svg';
import { useEffect, useRef, useState } from 'react';

// 메인 컴포넌트
export default function SmallSignBoard({ level, onOpenLarge }) {
  const [showDelete, setShowDelete] = useState(false); // 삭제 버튼 보이기 여부
  const [showConfirm, setShowConfirm] = useState(false); // 모달 보이기 여부
  const [isDeleted, setIsDeleted] = useState(false); // 실제 삭제 여부
  const isUnderFour = level < 4;
  const boardRef = useRef(null);

  const handleClick = () => {
    if (isUnderFour) {
      // 이미 삭제버튼이 보이는 상태에서 팻말 다시 클릭 → 텍스트로 복귀
      setShowDelete((prev) => !prev);
    } else {
      if (onOpenLarge) onOpenLarge();
    }
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    setIsDeleted(true); // 팻말 자체를 제거
    setShowConfirm(false);
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setShowDelete(false); // 취소 시 다시 텍스트 복귀
  };

  // 화면 바깥 클릭 시 → 텍스트로 복귀
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (boardRef.current && !boardRef.current.contains(e.target)) {
        setShowDelete(false); // 외부 클릭하면 닫기
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (isDeleted) return null;

  return (
    <>
      {/* 팻말 */}
      <div
        ref={boardRef}
        onClick={handleClick}
        className="
          absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          z-20
          w-[85.393px] h-[62.625px]
          sm:w-[200px] sm:h-[150px]
          md:w-[300px] md:h-[220px]
          lg:w-[400px] lg:h-[300px]
          xl:w-[500px] xl:h-[375px]
          p-0.5 cursor-pointer
        "
      >
        <img
          src={isUnderFour ? whiteSign : redSign}
          alt="작은 팻말"
          className="w-full h-full object-contain"
        />

        {/* 텍스트 or 삭제 버튼 */}
        <div className="absolute inset-0 flex items-center justify-center p-1 px-1.5 pb-3">
          {showDelete && isUnderFour ? (
            <DeleteButton onClick={handleDeleteClick} />
          ) : (
            <span
              className={`
                ${isUnderFour ? 'text-black' : 'text-white'}
                text-[10px] sm:text-xl md:text-2xl font-extrabold 
                rounded-lg text-center mx-1
              `}
            >
              교통사고 삼거리 진입불가
            </span>
          )}
        </div>
      </div>

      {/* 모달은 팻말 밖에서 전체 화면 기준으로 렌더링 */}
      {showConfirm && (
        <DeleteConfirmModal
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </>
  );
}

// 삭제 버튼 컴포넌트
function DeleteButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
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

// 삭제 확인 모달 컴포넌트
function DeleteConfirmModal({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 px-4">
      <div
        className="
          bg-white rounded-lg shadow-lg p-6 
          w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl
          text-center border-2 border-gray-950
        "
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
