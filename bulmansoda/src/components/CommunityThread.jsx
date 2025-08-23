import { useEffect, useState } from "react";
import { ThumbsUp, Trash2, Send } from "lucide-react";
import {
  fetchCenterMarkerCommunity,
  createCenterComment,
  deleteCenterComment,
  likeCenterComment,
} from "../api/centerMarker";
import DeleteConfirmModal from "./DeleteConfirmModal";

export default function CommunityThread({ userId, centerMarkerId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);
  const [targetComment, setTargetComment] = useState(null);

  // ✅ 마운트 시 서버에서 댓글 불러오기
  useEffect(() => {
    const loadComments = async () => {
      try {
        const data = await fetchCenterMarkerCommunity(userId, centerMarkerId);
        setComments(data.comments || []);
      } catch (e) {
        console.error("❌ 댓글 불러오기 실패:", e);
      }
    };
    loadComments();
  }, [userId, centerMarkerId]);

  // ✅ 댓글 좋아요
  const like = async (commentId) => {
    try {
      await likeCenterComment({ userId, commentId });
      setComments((prev) =>
        prev.map((c) =>
          c.commentId === commentId
            ? { ...c, likeCount: c.likeCount + 1, isLiked: true }
            : c
        )
      );
    } catch (e) {
      console.error("❌ 댓글 좋아요 실패:", e);
    }
  };

  // 댓글 삭제 (확인 모달에서 확정 시 호출)
  const remove = async () => {
    if (!targetComment) return;
    try {
      await deleteCenterComment(targetComment.commentId);
      setComments((prev) =>
        prev.filter((c) => c.commentId !== targetComment.commentId)
      );
    } catch (e) {
      console.error("❌ 댓글 삭제 실패:", e);
    } finally {
      setShowConfirm(false);
      setTargetComment(null);
    }
  };

  // ✅ 댓글 작성
  const addRootComment = async () => {
    const text = newComment.trim();
    if (!text) return;
    setLoading(true);
    try {
      await createCenterComment({ userId, centerMarkerId, content: text });
      // 댓글 추가 후 서버에서 최신 데이터 다시 가져오기
    const data = await fetchCenterMarkerCommunity(userId, centerMarkerId);
    setComments(data.comments || []);
      setNewComment("");
    } catch (e) {
      console.error("❌ 댓글 작성 실패:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative mx-auto max-w-md bg-white">
      <div className="pb-36 space-y-2">
        {comments.map((c) => (
          <CommentCard
            key={c.commentId}
            author={c.name}
            ts={new Date(c.createdAt).toLocaleString("ko-KR", {
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })}
            text={c.content}
            likes={c.likeCount}
            onLike={() => like(c.commentId)}
            onDelete={
              c.userId === userId
                ? () => {
                  setTargetComment(c);
                  setShowConfirm(true);
                }
                : undefined
            }
          />
        ))}
      </div>

      {/* 입력 바 */}
      <div className="fixed inset-x-0 bottom-0 z-20 bg-white/95 border-t border-gray-200 shadow-xl px-3 py-2">
        <div className="flex items-center gap-2">
          <input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addRootComment()}
            placeholder="댓글을 입력하세요."
            className="flex-1 rounded-xl border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
          <button
            onClick={addRootComment}
            disabled={loading}
            className="grid place-items-center rounded-xl bg-gray-900 text-white px-3 py-2 active:opacity-90 disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </div>
      </div>

      {/* 삭제 확인 모달 */}
      {showConfirm && (
        <DeleteConfirmModal
          onConfirm={remove}
          onCancel={() => {
            setShowConfirm(false);
            setTargetComment(null);
          }}
        />
      )}
    </div>
  );
}

function CommentCard({ author, ts, text, likes, onLike, onDelete }) {
  return (
    <div className="rounded-xl border-2 border-[#E52E21] p-3 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
      <div className="mb-1 flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-extrabold text-gray-900">{author}</span>
          <span className="text-[11px] text-gray-500">{ts}</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-[11px] text-gray-700">
            <span>{likes}</span>
            <ThumbsUp size={14} className="opacity-70" />
          </div>
          <button
            onClick={onLike}
            className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-2 py-1 text-[12px] text-gray-800 active:bg-gray-50"
          >
            <ThumbsUp size={14} />
          </button>
          {onDelete && (
            <button
              onClick={onDelete}
              className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-2 py-1 text-[12px] text-gray-800 active:bg-gray-50"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      {text && (
        <p className="mt-1 text-[13px] leading-relaxed text-gray-900">{text}</p>
      )}
    </div>
  );
}