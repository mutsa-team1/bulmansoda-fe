import { useEffect, useState } from "react";
import angryIcon from "../assets/angry.png";

export default function CenterLikeButton({ initialLikes = 0, onLike }) {
  const [likes, setLikes] = useState(initialLikes);
  const [loading, setLoading] = useState(false);

  // ✅ props 값이 바뀔 때마다 업데이트
  useEffect(() => {
    setLikes(initialLikes);
  }, [initialLikes]);

  const handleLike = async (e) => {
    e.stopPropagation();
    if (loading) return;
    setLoading(true);
    try {
      await onLike();
      setLikes((prev) => prev + 1);
    } catch (err) {
      console.error("❌ 공감 처리 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className="
        flex items-center justify-center gap-1.5
        px-3 h-[28px]
        rounded-full bg-[#1E1E1E]
        disabled:opacity-50
      "
    >
      <img src={angryIcon} alt="공감" className="w-5 h-5" />
      <span className="text-white text-base font-bold">{likes}</span>
    </button>
  );
}
