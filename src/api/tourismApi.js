/**
 * =========================================================
 * 한국관광공사 관광정보 API
 * 관광지, 축제, 숙소, 맛집 데이터를 조회
 * =========================================================
 */

const API_KEY =
  "726c30e17cf5b70715df9fb693e580a82dd5e51a611f8c1ee7250316248197c0";

const BASE_URL = "https://apis.data.go.kr/B551011/KorService2";

const commonParams =
  `serviceKey=${API_KEY}` +
  `&MobileOS=ETC` +
  `&MobileApp=TravelMap` +
  `&_type=json`;

const getItems = async (url) => {
  const response = await fetch(url);
  const data = await response.json();

  console.log("API 응답:", data);

  const header = data?.response?.header;

  if (header?.resultCode !== "0000") {
    console.error("API 오류:", header);
    return [];
  }

  const items = data?.response?.body?.items?.item;

  if (!items) return [];

  return Array.isArray(items) ? items : [items];
};

/* 관광지 목록 조회 */
export const getTourList = async (
  areaCode = "1",
  contentTypeId = "12",
  rows = 50,
  pageNo = 1
) => {
  const url =
    `${BASE_URL}/areaBasedList2?${commonParams}` +
    `&numOfRows=${rows}` +
    `&pageNo=${pageNo}` +
    `&arrange=Q` +
    `&areaCode=${areaCode}` +
    `&contentTypeId=${contentTypeId}`;

  return await getItems(url);
};

/* 여러 페이지 관광지 조회 */
export const getManyTourList = async (
  areaCode = "1",
  contentTypeId = "12",
  rows = 50,
  pages = 3
) => {
  const requests = [];

  for (let page = 1; page <= pages; page++) {
    requests.push(getTourList(areaCode, contentTypeId, rows, page));
  }

  const results = await Promise.all(requests);
  return results.flat();
};

/* 키워드 검색 */
export const searchTour = async (keyword, rows = 50, pageNo = 1) => {
  const url =
    `${BASE_URL}/searchKeyword2?${commonParams}` +
    `&numOfRows=${rows}` +
    `&pageNo=${pageNo}` +
    `&arrange=Q` +
    `&keyword=${encodeURIComponent(keyword)}`;

  return await getItems(url);
};

/* 여러 페이지 검색 */
export const getManySearchTour = async (keyword, rows = 50, pages = 3) => {
  const requests = [];

  for (let page = 1; page <= pages; page++) {
    requests.push(searchTour(keyword, rows, page));
  }

  const results = await Promise.all(requests);
  return results.flat();
};

/* 현재 위치 기준 관광지 조회 */
export const getNearbyTours = async (mapX, mapY, rows = 50, pageNo = 1) => {
  const url =
    `${BASE_URL}/locationBasedList2?${commonParams}` +
    `&numOfRows=${rows}` +
    `&pageNo=${pageNo}` +
    `&arrange=E` +
    `&mapX=${mapX}` +
    `&mapY=${mapY}` +
    `&radius=30000`;

  return await getItems(url);
};

/* 여러 페이지 위치 기반 조회 */
export const getManyNearbyTours = async (
  mapX,
  mapY,
  rows = 50,
  pages = 2
) => {
  const requests = [];

  for (let page = 1; page <= pages; page++) {
    requests.push(getNearbyTours(mapX, mapY, rows, page));
  }

  const results = await Promise.all(requests);
  return results.flat();
};

/* 관광지 상세 정보 조회 */
export const getTourDetail = async (contentId, contentTypeId) => {
  const url =
    `${BASE_URL}/detailCommon2?${commonParams}` +
    `&contentId=${contentId}` +
    `&contentTypeId=${contentTypeId}` +
    `&defaultYN=Y` +
    `&firstImageYN=Y` +
    `&addrinfoYN=Y` +
    `&mapinfoYN=Y` +
    `&overviewYN=Y`;

  const items = await getItems(url);
  return items[0] || null;
};