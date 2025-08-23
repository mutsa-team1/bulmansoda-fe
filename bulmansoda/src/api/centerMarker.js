import api from ".";

// 대표마커 열기 (GET)
export const fetchCenterMarkerCommunity = async (userId, centerMarkerId) => {
  const res = await api.get("/center/open", {
    params: { userId, centerMarkerId },
  });
  return res.data;
  /**
   * {
    "likeCount": 1,
    "comments": [
        {
            "commentId" : 1,  //댓글 삭제용
            "name": "Walter White",
            "userId" : 3,     //댓글 삭제버튼 공개여부(userId에 따라)
            "content": "Is it real?",
            "likeCount" : 5,
            "isLiked" : true,
            "createdAt": "2025-08-19T11:51:34.921+00:00"
        },
        {
            "commentId" : 2,
            "name": "John Snow",
            "userId" : 4,
            "content": "Im fucked up",
            "likeCount" : 3,
            "isLiked" : false,
            "createdAt": "2025-08-19T11:51:47.410+00:00"
        }
    ],
    "liked": false
  }
   */
};

// 대표마커 좋아요 (POST)
export const likeCenterMarker = async ({ userId, centerMarkerId }) => {
  try {
    const res = await api.post("/center/like", {
      userId,
      centerMarkerId,
    });
    return res.data; // 서버에서 반환하는 "생성된 좋아요 id" (숫자)
  } catch (error) {
    console.error("❌ [likeCenterMarker] API 호출 실패:", error);
    throw new Error(
      error.response?.data?.message || "대표마커 좋아요 요청에 실패했습니다."
    );
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
    return res.data; // 서버에서 반환하는 "생성된 댓글 id"
  } catch (error) {
    console.error("❌ [createCenterComment] API 호출 실패:", error);
    throw new Error(
      error.response?.data?.message || "대표마커 댓글 달기에 실패했습니다."
    );
  }
};

// 대표마커 댓글 삭제 (DELETE)
export const deleteCenterComment = async (commentId) => {
  try {
    const res = await api.delete("/center/comment/delete", {
      data: { commentId }, // 객체로 감싸기
    });
    return res.data; // 서버에서 success 여부를 반환하는 게 좋음
  } catch (error) {
    console.error("❌ [deleteCenterComment] API 호출 실패:", error);
    throw new Error(
      error.response?.data?.message || "대표마커 댓글 삭제에 실패했습니다."
    );
  }
};


// 댓글 좋아요 (POST)
export const likeCenterComment = async ({ userId, commentId }) => {
  try {
    const res = await api.post("/center/comment/like", {
      userId,
      commentId,
    });
    return res.data; // 서버에서 반환하는 "CommentLike id"
    //CommentLike object의 id값
  } catch (error) {
    console.error("❌ [likeCenterComment] API 호출 실패:", error);
    throw new Error(
      error.response?.data?.message || "댓글 좋아요 요청에 실패했습니다."
    );
  }
};