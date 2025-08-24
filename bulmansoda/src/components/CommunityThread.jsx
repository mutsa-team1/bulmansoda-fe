import { useEffect, useState } from "react";
import { Send } from "lucide-react";
import {
  fetchCenterMarkerCommunity,
  createCenterComment,
  deleteCenterComment,
  likeCenterComment,
} from "../api/centerMarker";
import DeleteConfirmModal from "./DeleteConfirmModal";

// --- 아이콘 SVG 컴포넌트 ---
const ReplyIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
  >
    <path
      d="M7.2998 2C8.41991 2 8.98038 1.99979 9.4082 2.21777C9.78446 2.40951 10.0905 2.71554 10.2822 3.0918C10.5002 3.51962 10.5 4.08009 10.5 5.2002V5.7998C10.5 6.91991 10.5002 7.48038 10.2822 7.9082C10.0905 8.28446 9.78446 8.59049 9.4082 8.78223C8.98038 9.00021 8.41991 9 7.2998 9H3.70703C3.57445 9.00002 3.44727 9.05273 3.35352 9.14648L2.35352 10.1465C2.03855 10.4614 1.50006 10.2384 1.5 9.79297V5.2002C1.5 4.08009 1.49979 3.51962 1.71777 3.0918C1.90951 2.71554 2.21554 2.40951 2.5918 2.21777C3.01962 1.99979 3.58009 2 4.7002 2H7.2998ZM4.5 6C4.22386 6 4 6.22386 4 6.5C4 6.77614 4.22386 7 4.5 7H6C6.27614 7 6.5 6.77614 6.5 6.5C6.5 6.22386 6.27614 6 6 6H4.5ZM4.5 4C4.22386 4 4 4.22386 4 4.5C4 4.77614 4.22386 5 4.5 5H7.5C7.77614 5 8 4.77614 8 4.5C8 4.22386 7.77614 4 7.5 4H4.5Z"
      fill="#1E1E1E"
    />
  </svg>
);
const LikeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
  >
    <path
      d="M2.22534 6.9541L5.70164 10.2197C5.82139 10.3322 5.88126 10.3885 5.95186 10.4023C5.98365 10.4086 6.01635 10.4086 6.04814 10.4023C6.11874 10.3885 6.17861 10.3322 6.29836 10.2197L9.77466 6.95411C10.7528 6.0353 10.8715 4.5233 10.0489 3.46303L9.89423 3.26367C8.91014 1.99529 6.93481 2.20801 6.24333 3.65683C6.14566 3.86148 5.85434 3.86148 5.75667 3.65683C5.06519 2.20801 3.08986 1.99529 2.10577 3.26367L1.95109 3.46303C1.12847 4.5233 1.24725 6.03529 2.22534 6.9541Z"
      fill="#1E1E1E"
      stroke="#1E1E1E"
    />
  </svg>
);
const DeleteIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="10"
    height="8"
    viewBox="0 0 10 8"
    fill="none"
  >
    <path
      d="M9.5 1.5C8.94772 1.5 8.5 1.94772 8.5 2.5V4.5C8.5 5.91421 8.49989 6.62121 8.06055 7.06055C7.62121 7.49989 6.91421 7.5 5.5 7.5H4.5C3.08579 7.5 2.37879 7.49989 1.93945 7.06055C1.50011 6.62121 1.5 5.91421 1.5 4.5V2.5C1.5 1.94772 1.05228 1.5 0.5 1.5V0H9.5V1.5ZM3.75 2C3.47386 2 3.25 2.22386 3.25 2.5V5C3.25 5.27614 3.47386 5.5 3.75 5.5C4.02614 5.5 4.25 5.27614 4.25 5V2.5C4.25 2.22386 4.02614 2 3.75 2ZM6.25 2C5.97386 2 5.75 2.22386 5.75 2.5V5C5.75 5.27614 5.97386 5.5 6.25 5.5C6.52614 5.5 6.75 5.27614 6.75 5V2.5C6.75 2.22386 6.52614 2 6.25 2Z"
      fill="#1E1E1E"
    />
  </svg>
);
const HeartIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
  >
    <path
      d="M2.22534 6.9541L5.70164 10.2197C5.82139 10.3322 5.88126 10.3885 5.95186 10.4023C5.98365 10.4086 6.01635 10.4086 6.04814 10.4023C6.11874 10.3885 6.17861 10.3322 6.29836 10.2197L9.77466 6.95411C10.7528 6.0353 10.8715 4.5233 10.0489 3.46303L9.89423 3.26367C8.91014 1.99529 6.93481 2.20801 6.24333 3.65683C6.14566 3.86148 5.85434 3.86148 5.75667 3.65683C5.06519 2.20801 3.08986 1.99529 2.10577 3.26367L1.95109 3.46303C1.12847 4.5233 1.24725 6.03529 2.22534 6.9541Z"
      fill="#FF4949"
    />
  </svg>
);

export default function CommunityThread({ userId, centerMarkerId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);
  const [targetComment, setTargetComment] = useState(null);

  const loadComments = async () => {
    if (!userId || !centerMarkerId) return;
    try {
      const data = await fetchCenterMarkerCommunity(userId, centerMarkerId);
      const processedComments = (data.comments || []).map((c) => ({
        ...c,
        isReply: !!c.parentId,
        isMine: c.userId === userId,
      }));
      setComments(processedComments);
    } catch (e) {
      console.error("❌ 댓글 불러오기 실패:", e);
    }
  };

  useEffect(() => {
    loadComments();
  }, [userId, centerMarkerId]);

  const handleLike = async (commentId) => {
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

  const handleDelete = async () => {
    if (!targetComment) return;
    try {
      await deleteCenterComment(targetComment.commentId);
      await loadComments(); // 삭제 후 목록 새로고침
    } catch (e) {
      console.error("❌ 댓글 삭제 실패:", e);
    } finally {
      setShowConfirm(false);
      setTargetComment(null);
    }
  };

  const handleAddComment = async () => {
    const text = newComment.trim();
    if (!text) return;
    setLoading(true);
    try {
      await createCenterComment({ userId, centerMarkerId, content: text });
      setNewComment("");
      await loadComments(); // 추가 후 목록 새로고침
    } catch (e) {
      console.error("❌ 댓글 작성 실패:", e);
    } finally {
      setLoading(false);
    }
  };

  const rootComments = comments.filter((c) => !c.isReply);

  return (
    <div className="relative mx-auto max-w-md bg-white p-2">
      <div className="pb-20 space-y-3">
        {rootComments.map((comment) => (
          <div key={comment.commentId}>
            <CommentCard
              {...comment}
              onLike={() => handleLike(comment.commentId)}
              onDelete={() => {
                setTargetComment(comment);
                setShowConfirm(true);
              }}
            />
            {comments
              .filter((reply) => reply.parentId === comment.commentId)
              .map((reply) => (
                <div key={reply.commentId} className="ml-5 mt-2">
                  <CommentCard
                    {...reply}
                    onLike={() => handleLike(reply.commentId)}
                    onDelete={() => {
                      setTargetComment(reply);
                      setShowConfirm(true);
                    }}
                  />
                </div>
              ))}
          </div>
        ))}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 bg-white/95 border-t border-gray-200 shadow-xl px-3 py-2">
        <div className="flex items-center gap-2">
          <input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
            placeholder="댓글을 입력하세요."
            className="flex-1 rounded-xl border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
          <button
            onClick={handleAddComment}
            disabled={loading}
            className="grid place-items-center rounded-xl bg-gray-900 text-white px-3 py-2 active:opacity-90 disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </div>
      </div>

      {showConfirm && (
        <DeleteConfirmModal
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
}

function CommentCard({
  name,
  content,
  likeCount,
  createdAt,
  isMine,
  isReply,
  onLike,
  onDelete,
}) {
  const cardClasses = isReply
    ? "p-3 rounded-[10px] bg-[#F4F4F4]"
    : "p-4 bg-white";

  const timestamp = new Date(createdAt).toLocaleString("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={cardClasses}>
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          {isReply && (
            <span className="text-xl leading-none text-gray-400">↳</span>
          )}
          <span className="font-bold text-sm">{name}</span>
          <div className="flex items-center gap-1">
            <HeartIcon />
            <span className="text-red-500 font-bold text-sm">{likeCount}</span>
          </div>
        </div>
      </div>

      <p className={`my-2 text-sm ${isReply ? "pl-5" : ""}`}>{content}</p>

      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-400">{timestamp}</span>
        <div className="flex items-center gap-1 rounded-lg bg-gray-200 p-1">
          {!isReply && (
            <button className="p-1 hover:bg-gray-300 rounded">
              <ReplyIcon />
            </button>
          )}
          <button onClick={onLike} className="p-1 hover:bg-gray-300 rounded">
            <LikeIcon />
          </button>
          {isMine && (
            <button onClick={onDelete} className="p-1 hover:bg-gray-300 rounded">
              <DeleteIcon />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}