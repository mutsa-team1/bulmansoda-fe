import sirenIcon from "../assets/siren.png";

export default function TrafficButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="
        absolute bottom-10 left-1/2 -translate-x-1/2 z-10
        w-[70%] max-w-dvw h-[54px] flex items-center justify-between
        px-4 py-1 rounded-2xl border-3 border-[#E52E21] bg-white
        shadow-md hover:bg-red-50 active:bg-red-100
        "
    >
      {/* 텍스트 */}
      <span className="block w-full text-center text-gray-950 font-extrabold text-2xl mt-1.5 mb-1.5">
        도로 상황 알리기
      </span>

      {/* 아이콘 */}
      <img src={sirenIcon} alt="신고" className="w-[40px] h-[40px] mt-0.5 mb-1.5" />
    </button>
  );
}
