// src/components/TrafficButton.jsx

// 기존 siren.png는 더 이상 사용되지 않습니다.
// import sirenIcon from "../assets/siren.png";

const NewSirenIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="17"
    height="17"
    viewBox="0 0 17 17"
    fill="none"
    className="flex-shrink-0"
  >
    <path
      d="M13.458 13.458L3.54132 13.458"
      stroke="#FFFEFE"
      strokeWidth="1.41667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.5 2.83301L8.50001 4.95801"
      stroke="#FFFEFE"
      strokeWidth="1.41667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14.521 6.375L12.7502 7.08333M2.47937 6.375L4.2502 7.08333"
      stroke="#FFFEFE"
      strokeWidth="1.41667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.396 3.89551L11.3335 5.31217M4.60437 3.89551L5.66687 5.31217"
      stroke="#FFFEFE"
      strokeWidth="1.41667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.3962 7.79199C10.9318 7.79222 11.3834 8.19113 11.4499 8.72266L12.0417 13.459H4.95868L5.55048 8.72266C5.61695 8.19096 6.06933 7.79199 6.60516 7.79199H10.3962ZM8.85419 8.5C8.65875 8.50018 8.49971 8.65901 8.49969 8.85449C8.49969 9.04998 8.65874 9.2088 8.85419 9.20898H10.2712C10.4666 9.20881 10.6247 9.04998 10.6247 8.85449C10.6247 8.65901 10.4666 8.50018 10.2712 8.5H8.85419Z"
      fill="#FFFEFE"
    />
  </svg>
);


export default function TrafficButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="
        absolute bottom-10 left-1/2 -translate-x-1/2 z-10
        flex justify-center items-center gap-[5px]
        w-[200px] h-[40px] rounded-full
        border border-[#FF4949] bg-[#F00]
        shadow-[0_3px_4px_0_rgba(155,155,155,0.20)]
        text-white font-bold text-[13px] leading-none
        hover:bg-red-700 active:bg-red-800
      "
    >
      <NewSirenIcon />
      <span>
        도로 상황 알리기
      </span>
    </button>
  );
}
