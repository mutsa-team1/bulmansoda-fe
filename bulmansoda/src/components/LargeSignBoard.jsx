import largeSignBoard from "../assets/largesignboard.svg";

// 팻말 - 불만 입력 창 
export default function LargeSignBoard() {
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

      {/* 텍스트 박스 */}
      <div className="absolute inset-0 flex items-center justify-center p-4 pb-14">
        <span
          className="
           text-white text-lg sm:text-xl md:text-2xl font-extrabold 
          rounded-lg px-4 py-2 text-center "
        >
          로터리 차간 사고 <br/>교통 정체 예상
        </span>
      </div>
    </div>
  );
}
