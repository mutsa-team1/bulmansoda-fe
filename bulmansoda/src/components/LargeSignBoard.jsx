import { useState } from "react";
import largeSignBoard from "../assets/largesignboard.svg";
import angryIcon from "../assets/angry.png";

/**
 * LargeSignBoard
 * props:
 * - title: string (팻말에 표시할 텍스트)
 * - likes: number (공감/댓글 수 등)
 * - onClose: () => void
 */
export default function LargeSignBoard({ title, initialLikes = 0, onClose }) {
  const [likes, setLikes] = useState(initialLikes);

  const addLike = () => {
    setLikes((prev) => prev + 1);
  };

  return (
    <div
      className="
        absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2
        z-[60]
        w-[250px] h-[185px] 
        sm:w-[300px] sm:h-[220px]
        md:w-[350px] md:h-[260px]
        lg:w-[400px] lg:h-[300px]
        p-2"
    >
      {/* 배경 이미지 */}
      <img
        src={largeSignBoard}
        alt="팻말 배경"
        className="w-full h-full object-contain"
      />

      {/* 텍스트 + 버튼 */}
      <div className="absolute inset-0 p-5 pb-14">
        {/* 텍스트 */}
        <span
          className="
            block
            text-white text-lg sm:text-xl md:text-2xl font-extrabold 
            text-left ml-3 mt-3
            whitespace-pre-wrap break-words
          "
        >
          {title}
        </span>

        {/* 버튼 (항상 우측 하단 고정) */}
        <div className="absolute bottom-13 right-6">
          <button
            onClick={addLike}
            className="
              flex items-center space-x-2 px-2.5 py-1.5 rounded-md text-sm font-semibold shadow-md
              bg-[#1E1E1E] text-white hover:bg-[#2c2c2c] active:bg-[#111111]
            "
          >
            <img src={angryIcon} alt="공감" className="w-5 h-5" />
            <span>{likes}</span>
          </button>
        </div>
      </div>

      {/* 닫기 버튼 */}
      <button
        onClick={onClose}
        className="absolute -top-0.5 -right-2 bg-black/60 hover:bg-black/80 text-white text-xs sm:text-sm rounded-full px-2 py-1"
      >
        X
      </button>
    </div>
  );
}
