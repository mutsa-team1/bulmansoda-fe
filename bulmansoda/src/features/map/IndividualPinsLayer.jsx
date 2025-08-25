import { CustomOverlayMap } from "react-kakao-maps-sdk";
import SmallSignBoard from "../../components/SmallSignBoard";

/**
 * 개인 모드 레이어: 기본 핀 및 조정 미리보기만 담당
 */
export default function IndividualPinsLayer({
  viewMode,
  subMode,
  pins,
  center,
  inputText,
  dummyId,
  onDelete,
}) {
  if (viewMode !== "individual") return null;

  return (
    <>
      {subMode === "default" &&
        pins.map((p) => (
          <CustomOverlayMap
            key={p.markerId}
            position={{ lat: p.latitude, lng: p.longitude }}
            xAnchor={0.5}
            yAnchor={1}
            zIndex={5}
          >
            <SmallSignBoard
              viewMode="individual"
              subMode="default"
              text={p.content}
              userId={p.userId || dummyId}       
              centerMarkerId={p.centerMarkerId}   
              onDelete={
                p.userId === dummyId ? () => onDelete(p.markerId) : undefined
              }
            />
          </CustomOverlayMap>
        ))}

      {subMode === "adjust" && (
        <CustomOverlayMap
          position={center}
          xAnchor={0.5}
          yAnchor={1.3}
          zIndex={5}
        >
          <SmallSignBoard
            viewMode="individual"
            subMode="adjust"
            text={inputText}
            userId={dummyId}   
          />
        </CustomOverlayMap>
      )}
    </>
  );
}
