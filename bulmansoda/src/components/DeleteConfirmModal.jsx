// src/components/DeleteConfirmModal.jsx

const InfoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="41"
    height="41"
    viewBox="0 0 41 41"
    fill="none"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M35.875 20.5C35.875 28.9914 28.9914 35.875 20.5 35.875C12.0086 35.875 5.125 28.9914 5.125 20.5C5.125 12.0086 12.0086 5.125 20.5 5.125C28.9914 5.125 35.875 12.0086 35.875 20.5ZM22.2083 13.6667C22.2083 14.6102 21.4435 15.375 20.5 15.375C19.5565 15.375 18.7917 14.6102 18.7917 13.6667C18.7917 12.7232 19.5565 11.9583 20.5 11.9583C21.4435 11.9583 22.2083 12.7232 22.2083 13.6667ZM22.208 29.0417V18.7917H18.792V29.0417H22.208Z"
      fill="#BBBBBB"
    />
  </svg>
);

export default function DeleteConfirmModal({ onConfirm, onCancel }) {
  // 모달 내용 클릭 시 이벤트 전파 방지
  const stopPropagation = (e) => e.stopPropagation();

  return (
    <div
      onClick={onCancel}
      className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={stopPropagation}
        className="
          flex flex-col items-center justify-center
          w-[280px] h-[180px] p-4
          bg-white rounded-[20px] shadow-lg
        "
      >
        <InfoIcon />
        <p className="text-sm font-bold text-gray-800 mt-2">
          작성한 도로 상황을 삭제하시겠습니까?
        </p>
        <p className="text-xs text-gray-500 mt-1">
          작성한 내용들은 모두 삭제됩니다.
        </p>

        <div className="flex justify-center space-x-4 mt-4">
          <button
            onClick={onCancel}
            className="
              w-[110px] h-[40px]
              bg-gray-200 hover:bg-gray-300 active:bg-gray-400
              text-gray-800 text-sm font-semibold
              rounded-lg transition-colors
            "
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="
              w-[110px] h-[40px]
              bg-red-500 hover:bg-red-600 active:bg-red-700
              text-white text-sm font-semibold
              rounded-lg transition-colors
            "
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}
