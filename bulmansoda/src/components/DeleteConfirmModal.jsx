// src/components/DeleteConfirmModal.jsx
export default function DeleteConfirmModal({ onConfirm, onCancel }) {
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
