function TourCard({ tour, onDetail, onFavorite, isFavorite }) {
  return (
    <div className="tour-card">
      <img
        src={
          tour.firstimage ||
          "https://via.placeholder.com/300x220?text=TravelMap"
        }
        alt={tour.title}
        onClick={() => onDetail(tour)}
      />

      <div className="card-info">
        <strong>{tour.title}</strong>
        <p>{tour.addr1 || "주소 정보 없음"}</p>

        <div className="card-actions">
          <button onClick={() => onDetail(tour)}>보기</button>
          <button onClick={() => onFavorite(tour)}>
            {isFavorite ? "♥" : "♡"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TourCard;