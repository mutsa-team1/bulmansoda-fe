import api from ".";
import { handleApiError } from "../utils/handleApiError";

// 대표마커 열기 (GET)
export const fetchCenterMarkerCommunity = async (userId, centerMarkerId) => {
  try {
    const res = await api.get("/center/open", {
      params: { userId, centerMarkerId },
    });
    return res.data;
  } catch (error) {
    handleApiError(error, "대표마커 세부 정보를 불러오는 데 실패했습니다.");
    throw error;
  }
};

// 대표마커 좋아요 (POST)
export const likeCenterMarker = async ({ userId, centerMarkerId }) => {
  try {
    const res = await api.post("/center/like", {
      userId,
      centerMarkerId,
    });
    return res.data; // 서버는 생성된 좋아요 id 반환
  } catch (error) {
    handleApiError(error, "대표마커 좋아요 등록에 실패했습니다.");
    throw error;
  }
};

// 대표마커 댓글 달기 (POST)
export const createCenterComment = async ({ userId, centerMarkerId, content }) => {
  try {
    const res = await api.post("/center/comment/create", {
      userId,
      centerMarkerId,
      content,
    });
    return res.data; // 서버에서 "생성된 댓글 id"
  } catch (error) {
    handleApiError(error, "대표마커 댓글 작성에 실패했습니다.");
    throw error;
  }
};

// 대표마커 댓글 삭제 (DELETE)
export const deleteCenterComment = async (commentId) => {
  try {
    const res = await api.delete("/center/comment/delete", {
      data: commentId,
    });
    return res.data ?? true;
  } catch (error) {
    handleApiError(error, "대표마커 댓글 삭제에 실패했습니다.");
    throw error;
  }
};


// 댓글 좋아요 (POST)
export const likeCenterComment = async ({ userId, commentId }) => {
  try {
    const res = await api.post("/center/comment/like", {
      userId,
      commentId,
    });
    return res.data; // 서버에서 CommentLike id 반환
  } catch (error) {
    handleApiError(error, "댓글 좋아요 등록에 실패했습니다.");
    throw error;
  }
};