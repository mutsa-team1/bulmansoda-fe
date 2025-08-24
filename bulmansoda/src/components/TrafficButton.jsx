import sirenIcon from "../assets/white-siren.svg";

export default function TrafficButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="
        absolute bottom-7 left-1/2 -translate-x-1/2 z-10
        w-[70%] max-w-dvw h-[42px] flex items-center justify-between
        px-8 py-1 rounded-4xl border-3 border-[#FF4949] bg-[#FF0000]
        shadow-md active:bg-red-800
      "
    >
      <img src={sirenIcon} alt="신고" className="w-[20px] h-[20px] mt-0.5 mb-1.5 mr-0.5"  />
      
      {/* 텍스트 */}
      <span className="block w-full text-center text-white text-md mt-1.5 mb-1.5">
        <span className="font-extrabold">도로 상황 </span>
        <span className="font-normal">알리기</span>
      </span>
    </button>
  );
}
