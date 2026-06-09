/**
 * 관광지 목록 출력 컴포넌트
 * 홈 : 가로 스크롤
 * 카테고리 : Grid 출력
 */
import TourCard from "./TourCard";

function SectionRow({
  title,
  tours,
  onDetail,
  onFavorite,
  favorites,
  layout = "row",
  emptyMessage = "표시할 관광지가 없습니다.",
}) {
  return (
    <section className="section-row">
      <div className="section-title">
        <h2>{title}</h2>
        <div></div>
      </div>

      {tours.length === 0 ? (
        <p className="empty-text">{emptyMessage}</p>
      ) : (
        <div className={layout === "grid" ? "card-grid" : "card-row"}>
          {tours.map((tour) => (
            <TourCard
              key={tour.contentid}
              tour={tour}
              onDetail={onDetail}
              onFavorite={onFavorite}
              isFavorite={favorites.some(
                (item) => item.contentid === tour.contentid
              )}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default SectionRow;