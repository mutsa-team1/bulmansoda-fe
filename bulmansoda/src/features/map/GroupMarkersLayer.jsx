import { CustomOverlayMap } from "react-kakao-maps-sdk";
import SmallSignBoard from "../../components/SmallSignBoard";

/**
 * 그룹 모드 레이어: 집계 마커만 담당
 */
export default function GroupMarkersLayer({
  viewMode,
  subMode,
  centers,
  dummyId,              // ✅ 더미 유저 id 받도록 추가
  onOpenCommunity,
}) {
  if (viewMode !== "group" || subMode !== "default") return null;

  return (
    <>
      {centers.map((gc) => (
        <CustomOverlayMap
          key={gc.centerMarkerId}
          position={{ lat: gc.latitude, lng: gc.longitude }}
          xAnchor={0.5}
          yAnchor={1}
          zIndex={5}
        >
          <SmallSignBoard
            viewMode="group"
            subMode="default"
            text={gc.keywords.join(" ")}
            userId={dummyId}                   // ✅ 항상 dummyId 넘김
            centerMarkerId={gc.centerMarkerId} // ✅ 공감 API용 id
            onOpenLarge={() => onOpenCommunity(gc)}
          />
        </CustomOverlayMap>
      ))}
    </>
  );
}
