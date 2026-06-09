/**
 * =========================================================
 * TravelMap
 * 한국관광공사 Open API를 활용한 여행 정보 플랫폼
 *
 * 주요 기능
 * 1. 관광지 검색
 * 2. 카테고리 조회
 * 3. 지역별 조회
 * 4. 위치 기반 관광지 추천
 * 5. 관심 관광지 저장
 * 6. 최근 검색어 저장
 * 7. 최근 본 관광지 저장
 * 8. 관광지 상세 정보 조회
 *
 * 개발 환경
 * React + Vite
 * =========================================================
 */

import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import SectionRow from "./components/SectionRow";
import SideMenu from "./components/SideMenu";
import TourDetail from "./components/TourDetail";
import Loading from "./components/Loading";
import ErrorMessage from "./components/ErrorMessage";
import {
  getManyTourList,
  getManySearchTour,
  getManyNearbyTours,
  getTourDetail,
} from "./api/tourismApi";

function App() {
  // 현재 페이지
  const [page, setPage] = useState("home");
  // 검색어
  const [keyword, setKeyword] = useState("");

  // 메인 슬라이드 관광지
  const [heroTours, setHeroTours] = useState([]);
  // 내 주변 관광지
  const [nearbyTours, setNearbyTours] = useState([]);
  // 관심 관광지
  const [favorites, setFavorites] = useState([]);
  // 최근 검색어
  const [recentSearches, setRecentSearches] = useState([]);
  // 최근 본 관광지
  const [recentViewed, setRecentViewed] = useState([]);

  const [sections, setSections] = useState({});
  const [searchResults, setSearchResults] = useState([]);
  const [categoryResults, setCategoryResults] = useState([]);

  const [selectedTour, setSelectedTour] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectedArea, setSelectedArea] = useState("all");
  const [selectedType, setSelectedType] = useState("12");
  const [categoryTitle, setCategoryTitle] = useState("관광지");

  const GOCHEOK_X = 126.8586;
  const GOCHEOK_Y = 37.4986;

  /* =========================================================
   지역 코드 정보
   한국관광공사 API 지역 코드 사용
========================================================= */
  const areas = [
    { code: "all", name: "전체 지역" },
    { code: "1", name: "서울" },
    { code: "2", name: "인천" },
    { code: "6", name: "부산" },
    { code: "31", name: "경기" },
    { code: "32", name: "강원" },
    { code: "33", name: "충북" },
    { code: "34", name: "충남" },
    { code: "35", name: "경북" },
    { code: "36", name: "경남" },
    { code: "37", name: "전북" },
    { code: "38", name: "전남" },
    { code: "39", name: "제주" },
  ];

  /* =========================================================
   관광 콘텐츠 유형
   관광지, 숙소, 맛집, 축제 등
========================================================= */
  const types = [
    { code: "12", name: "관광지" },
    { code: "14", name: "문화시설" },
    { code: "15", name: "축제·공연·행사" },
    { code: "28", name: "레포츠" },
    { code: "32", name: "숙소" },
    { code: "38", name: "쇼핑" },
    { code: "39", name: "맛집" },
  ];

  const getTypeName = (typeCode) => {
    return types.find((type) => type.code === typeCode)?.name || "관광지";
  };

  const getAreaName = (areaCode) => {
    return areas.find((area) => area.code === areaCode)?.name || "전체 지역";
  };

  /* =========================================================
   홈 화면 데이터 로드
========================================================= */
  const loadHome = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        nearby,
        seoulTour,
        busanTour,
        jejuTour,
        incheonTour,
        gyeonggiTour,
        gangwonTour,
        chungbukTour,
        chungnamTour,
        gyeongbukTour,
        gyeongnamTour,
        jeonbukTour,
        jeonnamTour,
        seoulFestival,
        busanFestival,
        jejuFestival,
        seoulFood,
        busanFood,
        jejuFood,
        seoulStay,
        culture,
        shopping,
        sports,
      ] = await Promise.all([
        getManyNearbyTours(GOCHEOK_X, GOCHEOK_Y, 50, 2),

        getManyTourList("1", "12", 50, 2),
        getManyTourList("6", "12", 50, 2),
        getManyTourList("39", "12", 50, 2),
        getManyTourList("2", "12", 50, 2),
        getManyTourList("31", "12", 50, 2),
        getManyTourList("32", "12", 50, 2),
        getManyTourList("33", "12", 50, 2),
        getManyTourList("34", "12", 50, 2),
        getManyTourList("35", "12", 50, 2),
        getManyTourList("36", "12", 50, 2),
        getManyTourList("37", "12", 50, 2),
        getManyTourList("38", "12", 50, 2),

        getManyTourList("1", "15", 50, 2),
        getManyTourList("6", "15", 50, 2),
        getManyTourList("39", "15", 50, 2),

        getManyTourList("1", "39", 50, 2),
        getManyTourList("6", "39", 50, 2),
        getManyTourList("39", "39", 50, 2),

        getManyTourList("1", "32", 50, 2),
        getManyTourList("1", "14", 50, 2),
        getManyTourList("1", "38", 50, 2),
        getManyTourList("1", "28", 50, 2),
      ]);

      setHeroTours([...seoulTour, ...jejuTour, ...busanTour].slice(0, 12));
      setNearbyTours(nearby);

      setSections({
        "인기 관광지": [...seoulTour, ...jejuTour, ...busanTour],
        "이번 달 인기 축제": [...seoulFestival, ...busanFestival, ...jejuFestival],
        "서울 맛집": seoulFood,
        "부산 맛집": busanFood,
        "제주 맛집": jejuFood,
        "추천 숙소": seoulStay,
        "문화시설": culture,
        "쇼핑": shopping,
        "레포츠": sports,
        "서울 관광지": seoulTour,
        "부산 관광지": busanTour,
        "제주 관광지": jejuTour,
        "인천 관광지": incheonTour,
        "경기 관광지": gyeonggiTour,
        "강원 관광지": gangwonTour,
        "충북 관광지": chungbukTour,
        "충남 관광지": chungnamTour,
        "경북 관광지": gyeongbukTour,
        "경남 관광지": gyeongnamTour,
        "전북 관광지": jeonbukTour,
        "전남 관광지": jeonnamTour,
      });

      setPage("home");
    } catch (err) {
      console.error(err);
      setError("데이터를 불러올 수 없습니다.");
    } finally {
      setLoading(false);
    }
  };
/* =========================================================
   카테고리 페이지 데이터 로드
========================================================= */
  const loadCategoryPage = async (
    areaCode = selectedArea,
    typeCode = selectedType
  ) => {
    try {
      setLoading(true);
      setError("");
      setMenuOpen(false);

      let result = [];

      if (areaCode === "all") {
        const [seoul, busan, jeju, gyeonggi, gangwon, incheon] =
          await Promise.all([
            getManyTourList("1", typeCode, 50, 2),
            getManyTourList("6", typeCode, 50, 2),
            getManyTourList("39", typeCode, 50, 2),
            getManyTourList("31", typeCode, 50, 2),
            getManyTourList("32", typeCode, 50, 2),
            getManyTourList("2", typeCode, 50, 2),
          ]);

        result = [...seoul, ...busan, ...jeju, ...gyeonggi, ...gangwon, ...incheon];
      } else {
        result = await getManyTourList(areaCode, typeCode, 50, 3);
      }

      setCategoryResults(result);
      setCategoryTitle(
        areaCode === "all"
          ? `전체 지역 ${getTypeName(typeCode)}`
          : `${getAreaName(areaCode)} ${getTypeName(typeCode)}`
      );
      setSelectedArea(areaCode);
      setSelectedType(typeCode);
      setPage("category");
    } catch (err) {
      console.error(err);
      setError("카테고리 정보를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  
  const handleCategory = async (typeId, title) => {
    setSelectedType(typeId);
    setSelectedArea("all");
    setCategoryTitle(title);
    await loadCategoryPage("all", typeId);
  };

/* =========================================================
   검색 기능
========================================================= */
  const handleSearch = async (word = keyword) => {
    if (word.trim() === "") return;

    try {
      setLoading(true);
      setError("");

      const result = await getManySearchTour(word, 50, 3);
      setSearchResults(result);

      const newRecent = [
        word,
        ...recentSearches.filter((item) => item !== word),
      ].slice(0, 6);

      setRecentSearches(newRecent);
      localStorage.setItem("recentSearches", JSON.stringify(newRecent));
      setPage("search");
    } catch (err) {
      console.error(err);
      setError("검색 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

/* =========================================================
   현재 위치 관광지 조회
========================================================= */
  const handleNearby = () => {
    if (!navigator.geolocation) {
      setError("현재 위치 기능을 사용할 수 없습니다.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          setLoading(true);
          setError("");

          const mapX = position.coords.longitude;
          const mapY = position.coords.latitude;
          const result = await getManyNearbyTours(mapX, mapY, 50, 2);

          setNearbyTours(result);
          setPage("nearby");
          setMenuOpen(false);
        } catch (err) {
          console.error(err);
          setError("내 주변 관광지를 불러오지 못했습니다.");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError("위치 권한을 허용해야 내 주변 관광지를 볼 수 있습니다.");
      }
    );
  };
/* =========================================================
   관광지 상세 정보 조회
========================================================= */
  const handleDetail = async (tour) => {
    try {
      setLoading(true);

      const detail = await getTourDetail(tour.contentid, tour.contenttypeid);
      const finalTour = detail || tour;

      setSelectedTour(finalTour);

      const newViewed = [
        tour,
        ...recentViewed.filter((item) => item.contentid !== tour.contentid),
      ].slice(0, 10);

      setRecentViewed(newViewed);
      localStorage.setItem("recentViewed", JSON.stringify(newViewed));
    } catch (err) {
      console.error(err);
      setSelectedTour(tour);
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
   관심 관광지 추가 / 삭제
========================================================= */
  const toggleFavorite = (tour) => {
    const exists = favorites.some((item) => item.contentid === tour.contentid);

    let newFavorites;

    if (exists) {
      newFavorites = favorites.filter(
        (item) => item.contentid !== tour.contentid
      );
    } else {
      newFavorites = [tour, ...favorites];
    }

    setFavorites(newFavorites);
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
  };

  /* =========================================================
   최초 실행
   LocalStorage 및 홈 데이터 로드
========================================================= */
  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const savedRecent = JSON.parse(localStorage.getItem("recentSearches")) || [];
    const savedViewed = JSON.parse(localStorage.getItem("recentViewed")) || [];

    setFavorites(savedFavorites);
    setRecentSearches(savedRecent);
    setRecentViewed(savedViewed);

    loadHome();
  }, []);

  const cardProps = {
    onDetail: handleDetail,
    onFavorite: toggleFavorite,
    favorites,
  };

  return (
    <div className="app">
      <Navbar
        keyword={keyword}
        setKeyword={setKeyword}
        onSearch={handleSearch}
        onHome={loadHome}
        onMenu={() => setMenuOpen(true)}
        onFavorite={() => {
          if (favorites.length === 0) {
            alert("찜한 관광지가 없습니다.");
            return;
          }

          setPage("favorite");
        }}
      />

      <SideMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onNearby={handleNearby}
        onCategory={handleCategory}
        recentSearches={recentSearches}
        onRecent={(word) => {
          setKeyword(word);
          setMenuOpen(false);
          handleSearch(word);
        }}
      />

      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && page === "home" && (
        <>
          <Hero tours={heroTours} onDetail={handleDetail} />

          <main className="home-content">
            <SectionRow
              title="내 주변 추천 여행지"
              tours={nearbyTours}
              emptyMessage="고척 근처 추천 여행지가 없습니다."
              {...cardProps}
            />

            <SectionRow
              title="관심있는 여행지"
              tours={favorites}
              emptyMessage="관심있는 여행지가 없습니다."
              {...cardProps}
            />

            <SectionRow
              title="최근 본 여행지"
              tours={recentViewed}
              emptyMessage="최근 본 여행지가 없습니다."
              {...cardProps}
            />

            {Object.entries(sections).map(([title, tours]) => (
              <SectionRow key={title} title={title} tours={tours} {...cardProps} />
            ))}
          </main>
        </>
      )}

      {!loading && !error && page === "category" && (
        <main className="page-content">
          <div className="filter-panel">
            <div>
              <h2>{categoryTitle}</h2>
              <p>지역과 카테고리를 선택해 원하는 여행지만 볼 수 있습니다.</p>
            </div>

            <div className="filter-controls">
              <select
                value={selectedArea}
                onChange={(e) => loadCategoryPage(e.target.value, selectedType)}
              >
                {areas.map((area) => (
                  <option key={area.code} value={area.code}>
                    {area.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedType}
                onChange={(e) => loadCategoryPage(selectedArea, e.target.value)}
              >
                {types.map((type) => (
                  <option key={type.code} value={type.code}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <SectionRow
            title={categoryTitle}
            tours={categoryResults}
            layout="grid"
            emptyMessage="해당 조건의 여행지가 없습니다."
            {...cardProps}
          />
        </main>
      )}

      {!loading && !error && page === "search" && (
        <main className="page-content">
          <SectionRow
            title={`"${keyword}" 검색 결과`}
            tours={searchResults}
            layout="grid"
            {...cardProps}
          />
        </main>
      )}

      {!loading && !error && page === "nearby" && (
        <main className="page-content">
          <SectionRow
            title="내 주변 관광지"
            tours={nearbyTours}
            layout="grid"
            {...cardProps}
          />
        </main>
      )}

      {!loading && !error && page === "favorite" && (
        <main className="page-content">
          <SectionRow
            title="찜한 여행지"
            tours={favorites}
            layout="grid"
            emptyMessage="찜한 관광지가 없습니다."
            {...cardProps}
          />
        </main>
      )}

      {selectedTour && (
        <TourDetail tour={selectedTour} onClose={() => setSelectedTour(null)} />
      )}

      <footer className="footer">
        <div className="footer-left">
          <p>08221 서울시 구로구 경인로 445 동양미래대학교</p>
          <p>TEL. 02-2610-1700 &nbsp;&nbsp;&nbsp; FAX. 02-2688-5494</p>
        </div>

        <div className="footer-right">
          COPYRIGHT(c) DONGYANG MIRAE UNIVERSITY. ALL RIGHTS RESERVED.
        </div>

        <button
          className="top-button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          ↑
        </button>
      </footer>
    </div>
  );
}

export default App;