/**
 * 사이드 메뉴
 * 카테고리 및 최근 검색어 제공
 */
function SideMenu({
  open,
  onClose,
  onNearby,
  onCategory,
  recentSearches,
  onRecent,
}) {
  if (!open) return null;

  /* 사이드 메뉴 출력 */
  return (
    <div className="side-bg" onClick={onClose}>
      <aside className="side-menu" onClick={(e) => e.stopPropagation()}>
        <button className="side-close" onClick={onClose}>
          ×
        </button>

        <h2>TravelMap</h2>

        <div className="menu-group">
          <h3>관광 콘텐츠 찾기</h3>
          <button onClick={() => onCategory("12", "관광지")}>관광지</button>
          <button onClick={() => onCategory("15", "축제·공연·행사")}>
            축제·공연·행사
          </button>
          <button onClick={() => onCategory("39", "맛집")}>맛집</button>
          <button onClick={() => onCategory("32", "숙소")}>숙소</button>
          <button onClick={() => onCategory("38", "쇼핑")}>쇼핑</button>
          <button onClick={() => onCategory("28", "레포츠")}>레포츠</button>
        </div>

        <div className="menu-group">
          <h3>추천 서비스</h3>
          <button onClick={onNearby}>내 주변 관광지</button>
        </div>

        <div className="menu-group">
          <h3>최근 검색어</h3>
          {recentSearches.length === 0 ? (
            <p>최근 검색어가 없습니다.</p>
          ) : (
            recentSearches.map((item) => (
              <button key={item} onClick={() => onRecent(item)}>
                {item}
              </button>
            ))
          )}
        </div>
      </aside>
    </div>
  );
}

export default SideMenu;