import SearchBar from "../../components/SearchBar";
import TrafficButton from "../../components/TrafficButton";
import InputSignBoard from "../../components/InputSignBoard";

/**
 * HUD(상단 배지/에러/검색 + 입력/조정 버튼 등)만 담당
 * 지도 위 절대 배치 UI를 한데 모음
 */
export default function HUD({
  inputRef,
  onSearch,
  // level,
  viewMode,
  subMode,
  // pinsCount,
  error,
  onClearError, // 선택사항
  onOpenInput,
  onCancelInput,
  onSubmitInput,
  onAdjustConfirm,
}) {
  return (
    <>
      {/* 검색 */}
      <SearchBar ref={inputRef} onSearch={onSearch} />

      {/* 상태/에러 배지 */}
      <div className="absolute top-2.5 left-2.5 right-2.5 z-20 h-7 pointer-events-none">
        <div
          className={`absolute -bottom-11 right-3 
    ${viewMode === "individual" ? "bg-red-300/95" : "bg-red-300/95"} 
    px-3 py-1.5 rounded-lg shadow-md text-gray-800 text-xs font-bold`}
        >
          {viewMode === "individual" ? "📌 개별 마커 모드" : "🗨️ 대표 마커 모드"}

        </div>
        <div
          className="absolute -bottom-[66px] right-2.5
      bg-gray-300/50 py-1 px-0.5 rounded-md shadow text-gray-700 text-[8px] font-bold"
        >
          확대/축소하여 모드를 변경하세요.
        </div>
      </div>

      {error && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
          {error}
          {onClearError && (
            <button
              className="ml-2 underline"
              onClick={onClearError}
            >
              닫기
            </button>
          )}
        </div>
      )}

      {/* 입력 모달 */}
      {viewMode === "individual" && subMode === "input" && (
        <InputSignBoard onSubmit={onSubmitInput} onCancel={onCancelInput} />
      )}

      {/* 조준선 + 위치 확정 */}
      {viewMode === "individual" && subMode === "adjust" && (
        <>
          <div className="pointer-events-none absolute inset-0 z-20">
            <div className="absolute left-1/2 top-0 -translate-x-1/2 w-px h-full bg-black/20"></div>
            <div className="absolute top-1/2 left-0 -translate-y-1/2 h-px w-full bg-black/20"></div>
          </div>
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20">
            <button
              onClick={onAdjustConfirm}
              className="px-6 py-2 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white rounded-xl shadow-md"
            >
              위치 확정
            </button>
          </div>
        </>
      )}

      {/* 신고 버튼 */}
      {viewMode === "individual" && subMode === "default" && (
        <TrafficButton onClick={onOpenInput} />
      )}
    </>
  );
}
