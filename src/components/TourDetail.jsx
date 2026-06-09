/**
 * 관광지 상세 정보 모달
 * 이미지, 설명, 주소, 지도 링크 출력
 */
function TourDetail({ tour, onClose }) {
  const mapUrl =
    tour.mapx && tour.mapy
      ? `https://map.kakao.com/link/map/${tour.title},${tour.mapy},${tour.mapx}`
      : null;

  return (
    <div className="detail-bg" onClick={onClose}>
      <div className="detail-box" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>

        <img
          src={
            tour.firstimage ||
            "https://via.placeholder.com/800x420?text=TravelMap"
          }
          alt={tour.title}
        />

        <div className="detail-content">
          <h2>{tour.title}</h2>

          <p className="detail-addr">{tour.addr1 || "주소 정보 없음"}</p>

          {tour.tel && <p>전화번호: {tour.tel}</p>}

          <p className="overview">
            {tour.overview
              ? tour.overview.replace(/<[^>]*>/g, "")
              : "상세 설명이 없습니다."}
          </p>


          {mapUrl && (
            <a href={mapUrl} target="_blank" rel="noreferrer">
              카카오맵으로 보기
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default TourDetail;