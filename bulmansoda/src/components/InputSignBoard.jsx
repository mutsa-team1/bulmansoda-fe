import { useState } from "react";
import inputSignBoard from "../assets/inputsignboard.svg";

// 팻말 - 불만 입력 창
export default function InputSignBoard({ onSubmit, onCancel }) {
  const [text, setText] = useState(""); // ✅ 초기값 빈 문자열

  const handleSubmit = () => {
    const value = text.trim();
    if (!value) {
      alert("불만을 입력해주세요!");
      return;
    }
    onSubmit?.(value);
    setText("");
    console.log(text);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
    if (e.key === "Escape") onCancel?.();
  };

  return (
    <div
      className="
        absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        z-20
        w-[250px] h-[185px]
        sm:w-[300px] sm:h-[220px]
        md:w-[350px] md:h-[260px]
        lg:w-[400px] lg:h-[300px]
        p-2
      "
      role="dialog"
      aria-modal="true"
    >
      {/* 배경 이미지 (클릭 방해 X) */}
      <img
        src={inputSignBoard}
        alt="팻말 배경"
        className="w-full h-full object-contain pointer-events-none select-none"
        draggable={false}
      />

      {/* 좌측 상단 X 버튼 */}
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          aria-label="닫기"
          className="
            absolute top-2.5 left-4
            w-8 h-8 sm:w-9 sm:h-9
            grid place-items-center
            rounded-full
            text-gray-800 text-lg sm:text-xl font-bold
            hover:bg-white-1000 hover:shadow
            active:bg-gray-50
            z-10
          "
        >
          ×
        </button>
      )}

      {/* 입력 박스 + 완료 버튼 */}
      <div className="absolute inset-0 flex items-center justify-center p-4 pb-14">
        <div className="relative w-full max-w-[90%]">
          <input
            type="text"
            maxLength={12}
            placeholder="공백 포함 최대 12자 입력"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            className="
              w-full
              bg-white/80 text-gray-700 text-sm sm:text-base md:text-lg font-normal
              rounded-md px-2 py-2 text-left mb-2
              placeholder-gray-400 border-1 border-gray-50 shadow-sm
              focus:outline-none focus:ring-1 focus:ring-gray-400
            "
          />

          {/* 완료 버튼 (입력창 바깥 우측 하단) */}
          <button
            type="button"
            onClick={handleSubmit}
            className="
              absolute -bottom-8 right-0
              bg-[#F00000] hover:bg-[#d00000] active:bg-[#a00000]
              text-white text-xs sm:text-sm font-medium
              rounded-md px-[17px] py-[7px] shadow-sm shadow-red-200
              focus:outline-none focus:ring-1 focus:ring-red-400
            "
          >
            완료
          </button>
        </div>
      </div>
    </div>
  );
}
