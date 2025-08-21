// CommunityThread.jsx
import { useState } from "react";
import { ThumbsUp, Trash2, Send } from "lucide-react";

// 샘플 데이터
const initialComments = [
  {
    id: "c1",
    author: "피해자1",
    ts: "08/20 07:30",
    text: "로터리에서 SUV가 무리하게 끼어들다 택시 박음요.",
    likes: 1,
  },
  {
    id: "c2",
    author: "피해자1",
    ts: "08/20 07:30",
    text: "로터리에서 SUV가 무리하게 끼어들다 택시 박음요.",
    likes: 0,
  },
  {
    id: "c3",
    author: "피해자2",
    ts: "08/20 07:30",
    text: "",
    likes: 0,
  },
];

export default function CommunityThread() {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");
  const currentUser = "피해자3";

  const like = (id) => {
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, likes: c.likes + 1 } : c))
    );
  };

  // const report = (id) => {
  //   // 실제 구현 시: 신고 API 호출
  //   alert("신고가 접수되었습니다.");
  // };

  const addRootComment = () => {
    const text = newComment.trim();
    if (!text) return;
    setComments((prev) => [
      ...prev,
      {
        id: `c_${Date.now()}`,
        author: currentUser,
        ts: new Date()
          .toLocaleString("ko-KR", {
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })
          .replace(",", ""),
        text,
        likes: 0,
      },
    ]);
    setNewComment("");
  };

  return (
    <div className="relative mx-auto max-w-md bg-white">
      <div className="pb-36 space-y-2">
        {comments.map((c) => (
          <CommentCard
            key={c.id}
            author={c.author}
            ts={c.ts}
            text={c.text}
            likes={c.likes}
            onLike={() => like(c.id)}
            // onReport={() => report(c.id)}
          />
        ))}
      </div>

      {/* 하단 입력 바 (고정) */}
      <div className="fixed inset-x-0 bottom-0 z-20 bg-white/95 border-t px-3 py-2 pb-[calc(env(safe-area-inset-bottom)+8px)]">
        <div className="flex items-center gap-2">
          <span className="shrink-0 text-sm font-extrabold text-gray-900">
            {currentUser}
          </span>
          <input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addRootComment()}
            placeholder="댓글을 입력하세요."
            className="flex-1 rounded-xl border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
          <button
            onClick={addRootComment}
            className="grid place-items-center rounded-xl bg-gray-900 text-white px-3 py-2 active:opacity-90"
            aria-label="전송"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

function CommentCard({ author, ts, text, likes, onLike, onReport }) {
  return (
    <div className="rounded-xl border-2 border-[#E52E21] p-3 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
      {/* 헤더 */}
      <div className="mb-1 flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-extrabold text-gray-900">{author}</span>
          <span className="text-[11px] text-gray-500">{ts}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* 좋아요 카운트 */}
          <div className="flex items-center gap-1 text-[11px] text-gray-700">
            <span>{likes}</span>
            <ThumbsUp size={14} className="opacity-70" />
          </div>

          {/* 액션 버튼들 (좋아요 / 신고) */}
          <button
            onClick={onLike}
            className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-2 py-1 text-[12px] text-gray-800 active:bg-gray-50"
          >
            <ThumbsUp size={14} />
          </button>
          <button
            onClick={onReport}
            className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-2 py-1 text-[12px] text-gray-800 active:bg-gray-50"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* 본문 */}
      {text && (
        <p className="mt-1 text-[13px] leading-relaxed text-gray-900">
          {text}
        </p>
      )}
    </div>
  );
}
