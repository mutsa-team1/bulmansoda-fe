import BottomSheet from "../../components/BottomSheet";
import CommunityThread from "../../components/CommunityThread";
import LargeSignBoard from "../../components/LargeSignBoard";

/**
 * 커뮤니티 모드 전용 패널(LargeSignBoard + BottomSheet)
 */
export default function CommunityPanel({
  open,
  onClose,
  selectedBoard,     // { keywords, likes, centerMarkerId, ... }
  selectedCenter,    // { centerMarkerId, latitude, longitude, keywords }
  dummyId,
}) {
  if (!open) return null;

  const sheetOpen = !!selectedCenter;

  return (
    <>
      {selectedBoard && (
        <div className="fixed top-52 left-1/2 -translate-x-1/2 z-[55]">
          <LargeSignBoard
            title={selectedBoard.keywords.join(" ")}
            initialLikes={selectedBoard.likes ?? 0}
            userId={dummyId}
            centerMarkerId={selectedBoard.centerMarkerId}
            onClose={onClose}
          />
        </div>
      )}

      <BottomSheet
        open={sheetOpen}
        onClose={onClose}
        snapPoints={[140, "45dvh", "85dvh"]}
        initialSnap={1}
        showBackdrop={false}
      >

        {/* {selectedCenter && (
          <div className="mb-3 space-y-2">
            <div className="text-sm text-gray-500">
              centerId: <b>{selectedCenter.centerMarkerId}</b> ·{" "}
              {selectedCenter.latitude.toFixed(5)},{" "}
              {selectedCenter.longitude.toFixed(5)}
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedCenter.keywords.map((k, i) => (
                <span
                  key={i}
                  className="rounded-full border px-2 py-0.5 text-xs"
                >
                  #{k}
                </span>
              ))}
            </div>
          </div>
        )} */}

        {selectedCenter && (
          <CommunityThread
            userId={dummyId}
            centerMarkerId={selectedCenter.centerMarkerId}
          />
        )}
      </BottomSheet>
    </>
  );
}
