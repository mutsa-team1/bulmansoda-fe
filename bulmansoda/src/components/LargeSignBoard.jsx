import { useState } from "react";
import largeSignBoard from "../assets/largesignboard.svg";
import angryIcon from '../assets/angry.png';

// 팻말 - level4 이후 세부 내용 보여주는 팻말
export default function LargeSignBoard({ onClose }) {
  const [likes, setLikes] = useState(0); // 공감 수

  const addLike = () => { // 추후 사용자별 1회로 제한 기능 구현 
    setLikes(likes + 1); // 누를 때마다 +1
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
        p-2"
    >
      {/* 배경 이미지 */}
      <img
        src={largeSignBoard}
        alt="팻말 배경"
        className="w-full h-full object-contain"
      />

      {/* 텍스트 + 버튼 */}
      <div className="absolute inset-0 flex flex-col justify-center p-5 pb-14">
        {/* 텍스트 (좌측 정렬) */}
        <span
          className="
            text-white text-lg sm:text-xl md:text-2xl font-extrabold 
            text-left ml-3 mt-3
          "
        >
          로터리 차간 사고 <br />교통 정체 예상
        </span>

        {/* 버튼 (텍스트 바로 아래, 우측 정렬) */}
        <div className="flex justify-end mt-4">
          <button
            onClick={addLike}
            className="
              flex items-center space-x-2 px-2.5 py-1.5 mb-1 mr-1 rounded-md text-sm font-semibold shadow-md
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
        className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white text-xs sm:text-sm rounded-full px-2 py-1"
      >
        X
      </button>
    </div>
  );
}

