// 스케일에 따라 서로 다른 배경 이미지, 서로 다른 데이터 불러옴
// level 1~3 자신이 쓴 글 삭제하는 기능 있음, 좋아요 기능 없음 
// 클릭 불가능 

// level 4 부터는 raw data가 아닌 별도 클러스터링된 데이터 가져옴 
// level 4 클러스터링 데이터에 대해서는 공감 기능 있음 
// 클릭 가능 -> 클릭 시 LargeSignBoard 보여줌 

import whiteSign from '../assets/whitesign.svg';
import redSign from '../assets/redsign.svg';

// scale 정보 받아오는 것 필요함 
export default function SmallSignBoard({ level }) {
  const isUnderFour = level < 4;
  return (
    <div className='
                absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                z-20
                 w-[85.393px] h-[62.625px]   /* 기본 (410px 기기) */
                 sm:w-[200px] sm:h-[150px]   /* 작은 태블릿 */
                 md:w-[300px] md:h-[220px]   /* 중간 화면 */
                 lg:w-[400px] lg:h-[300px]   /* 큰 화면 */
                 xl:w-[500px] xl:h-[375px]   /* 초대형 화면 */
                p-0.5'>
      <img
        src={isUnderFour ? whiteSign : redSign}
        alt="작은 팻말"
        className='w-full h-full object-contain'
      />

      {/* 텍스트 박스 */}
      <div className="absolute inset-0 flex items-center justify-center p-1 px-1.5 pb-3">
        <span
          className={`
            ${isUnderFour ? "text-black" : "text-white"}
            text-[10px] sm:text-xl md:text-2xl font-extrabold 
            rounded-lg text-center mx-1
          `}
        >
          교통사고 삼거리 진입불가
        </span>
      </div>
    </div>
  );
}