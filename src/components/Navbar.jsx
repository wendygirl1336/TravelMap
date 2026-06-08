function Navbar({
  keyword,
  setKeyword,
  onSearch,
  onHome,
  onMenu,
  onFavorite,
}) {
  return (
    <nav className="top-nav">
      <h1 onClick={onHome}>TravelMap</h1>

      <div className="nav-search">
        <input
          value={keyword}
          placeholder="여행지를 한눈에"
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSearch();
          }}
        />

        <button onClick={() => onSearch()}>⌕</button>
      </div>

      <div className="nav-icons">
        <button onClick={onFavorite}>♡</button>
        <button onClick={onMenu}>☰</button>
      </div>
    </nav>
  );
}

export default Navbar;