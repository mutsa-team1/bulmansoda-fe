import { useEffect, useState } from "react";
import angryIcon from "../assets/angry.png";
import {
  fetchCenterMarkerCommunity,
  likeCenterMarker,
} from "../api/centerMarker";

export default function LargeSignBoard({
  title,
  userId,
  centerMarkerId,
  onClose,
}) {
  const [likes, setLikes] = useState(0);
  const [loading, setLoading] = useState(false);

  // ✅ 백엔드에서 데이터를 불러오는 기존 로직입니다.
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchCenterMarkerCommunity(userId, centerMarker.id);
        setLikes(data.likeCount);
      } catch (e) {
        console.error("❌ 초기 데이터 불러오기 실패:", e);
      }
    };
    loadData();
  }, [userId, centerMarkerId]);

  // ✅ '좋아요'를 누르면 백엔드에 요청을 보내는 기존 로직입니다.
  const addLike = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await likeCenterMarker({ userId, centerMarkerId });
      setLikes((prev) => prev + 1);
    } catch (error) {
      console.error("❌ 공감 처리 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2
        z-[60]
      "
    >
      {/* ✅ 새로운 디자인을 적용한 부분입니다. */}
      <div
        className="
          relative w-[300px] h-[200px] p-5
          flex flex-col justify-between
          rounded-[46px]
          bg-gradient-to-br from-[#F00] to-[#FF4949]
          shadow-[2px_2px_6px_0_rgba(155,155,155,0.10)]
        "
      >
        {/* 팻말 내용 */}
        <span
          className="
            text-white text-2xl font-bold
            whitespace-pre-wrap break-words
          "
        >
          {title}
        </span>

        {/* 좋아요 버튼 */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            addLike();
          }}
          disabled={loading}
          className="
            flex items-center justify-center gap-1.5
            self-end
            px-3 h-[28px]
            rounded-full bg-[#1E1E1E]
            disabled:opacity-50
          "
        >
          <img src={angryIcon} alt="공감" className="w-5 h-5" />
          <span className="text-white text-base font-bold">{likes}</span>
        </button>
      </div>

      {/* 닫기 버튼 */}
      <button
        onClick={onClose}
        className="absolute top-2 right-4.5 bg-black/60 hover:bg-black/80 text-white text-sm rounded-full w-7 h-7 flex items-center justify-center"
      >
        X
      </button>
    </div>
  );
}
