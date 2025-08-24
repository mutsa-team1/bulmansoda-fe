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

// 고정 위치 아이콘
const FixedLocationIcon = () => (
  <div className="relative w-[43px] h-[43px]">
    {/* 배경 원 */}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="43"
      height="43"
      viewBox="0 0 43 43"
      fill="none"
      className="absolute inset-0"
    >
      <circle
        opacity="0.7"
        cx="21.5"
        cy="21.5"
        r="21.5"
        fill="url(#paint0_linear_288_312)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_288_312"
          x1="6.45"
          y1="6.09167"
          x2="39.4167"
          y2="43"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#BBBBBB" />
          <stop offset="1" stopColor="#D9D9D9" />
        </linearGradient>
      </defs>
    </svg>
    {/* 중앙 타겟 */}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="23"
      height="23"
      viewBox="0 0 23 23"
      fill="none"
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
    >
      <path
        d="M11.4996 5.22949C14.9628 5.22949 17.7709 8.03686 17.7711 11.5C17.7711 14.9633 14.9629 17.7715 11.4996 17.7715C8.0365 17.7713 5.22913 14.9632 5.22913 11.5C5.2293 8.03697 8.03661 5.22967 11.4996 5.22949ZM11.5006 8.8125C10.0165 8.8125 8.81329 10.0159 8.81311 11.5C8.81311 12.9843 10.0163 14.1875 11.5006 14.1875C12.9847 14.1872 14.1881 12.9841 14.1881 11.5C14.1879 10.0161 12.9845 8.81276 11.5006 8.8125Z"
        fill="#1E1E1E"
      />
      <path
        d="M11.5 5.22917V3.4375"
        stroke="#1E1E1E"
        strokeWidth="1.79167"
        strokeLinecap="round"
      />
      <path
        d="M17.7708 11.5L19.5625 11.5"
        stroke="#1E1E1E"
        strokeWidth="1.79167"
        strokeLinecap="round"
      />
      <path
        d="M11.5 19.5622L11.5 17.7705"
        stroke="#1E1E1E"
        strokeWidth="1.79167"
        strokeLinecap="round"
      />
      <path
        d="M3.43746 11.5H5.22913"
        stroke="#1E1E1E"
        strokeWidth="1.79167"
        strokeLinecap="round"
      />
    </svg>
  </div>
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

      {/* 고정 위치 아이콘 */}
      <FixedLocationIcon />
    </div>
  );
}
