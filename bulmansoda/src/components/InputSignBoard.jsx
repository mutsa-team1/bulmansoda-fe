import { useState } from "react";
import toast from "react-hot-toast";

// 도로 상황 작성하기 아이콘
const InfoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="17"
    height="17"
    viewBox="0 0 17 17"
    fill="none"
  >
    <path
      d="M8.5 2.125C12.0208 2.125 14.875 4.97918 14.875 8.5C14.875 12.0208 12.0208 14.875 8.5 14.875C4.97918 14.875 2.125 12.0208 2.125 8.5C2.125 4.97918 4.97918 2.125 8.5 2.125ZM7.4375 7.79199C7.04641 7.79199 6.72967 8.10895 6.72949 8.5C6.72967 8.89105 7.04641 9.20898 7.4375 9.20898H7.79199V11.334C7.79234 11.7249 8.10902 12.042 8.5 12.042H9.91699C10.3078 12.0418 10.6246 11.7248 10.625 11.334C10.625 10.9429 10.308 10.6252 9.91699 10.625H9.20801V8.5C9.20783 8.10895 8.89109 7.79199 8.5 7.79199H7.4375ZM8.5 4.95898C8.1088 4.95899 7.79199 5.27579 7.79199 5.66699C7.79217 6.05804 8.10891 6.375 8.5 6.375H8.50684C8.89793 6.375 9.21564 6.05804 9.21582 5.66699C9.21582 5.27579 8.89804 4.95898 8.50684 4.95898H8.5Z"
      fill="#FF4949"
    />
  </svg>
);

export default function InputSignBoard({ onSubmit, onCancel }) {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    const value = text.trim();
    if (!value) {
      toast.error("내용을 입력해주세요!");
      return;
    }
    onSubmit?.(value);
    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
    if (e.key === "Escape") onCancel?.();
  };

  return (
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-2"
      role="dialog"
      aria-modal="true"
    >
      {/* 입력창 */}
      <div
        className="
          flex flex-col items-center justify-center gap-8
          p-6
          w-[300px] h-[250px]
          bg-white rounded-[20px]
          shadow-[2px_2px_10px_0_rgba(155,155,155,0.30)]
        "
      >
        <div className="flex items-center gap-2">
          <InfoIcon />
          <h2 className="text-lg font-bold text-[#FF4949]">
            도로 상황 작성하기
          </h2>
        </div>

        <div className="w-full text-center">
          <input
            type="text"
            maxLength={14}
            placeholder="공백 포함 14자 이내"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            className="
              w-full text-center text-base
              border-b-2 border-gray-200
              focus:outline-none focus:border-[#FF4949]
              transition-colors
              placeholder:text-sm placeholder:text-gray-400
            "
          />
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className="
            w-[200px] h-[40px] rounded-lg
            bg-[#FF4949] hover:bg-red-600 active:bg-red-700
            text-white text-sm font-bold
            transition-colors
          "
        >
          도로 상황 작성 완료!
        </button>
      </div>

      {/* 닫기 버튼 */}
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          aria-label="닫기"
          className="absolute top-2 right-2 w-6 h-6 grid place-items-center rounded-full bg-black/50 text-white text-sm hover:bg-black/70"
        >
          ×
        </button>
      )}

    </div>
  );
}
