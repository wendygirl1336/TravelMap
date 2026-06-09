/**
 * 한국관광공사 관광정보 API
 * 요청 제한 429 방지 버전
 * 기능은 그대로 유지
 */

const API_KEY =
  "726c30e17cf5b70715df9fb693e580a82dd5e51a611f8c1ee7250316248197c0";

const BASE_URL = "https://apis.data.go.kr/B551011/KorService2";

const commonParams =
  `serviceKey=${API_KEY}` +
  `&MobileOS=ETC` +
  `&MobileApp=TravelMap` +
  `&_type=json`;

// 캐시 유지 시간: 12시간
const CACHE_TIME = 1000 * 60 * 60 * 12;

// 요청 사이 간격
const REQUEST_DELAY = 700;

// 429 발생 시 잠시 API 요청 중단
const BLOCK_TIME = 1000 * 60 * 10;

let requestQueue = Promise.resolve();

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getBlockUntil = () => {
  return Number(localStorage.getItem("travelmap_block_until")) || 0;
};

const setBlockUntil = () => {
  localStorage.setItem("travelmap_block_until", String(Date.now() + BLOCK_TIME));
};

/**
 * API 응답 공통 처리
 */
const getItems = async (url) => {
  const blockUntil = getBlockUntil();

  if (Date.now() < blockUntil) {
    console.warn("요청 제한 보호 중입니다. 캐시 데이터만 사용합니다.");
    return null;
  }

  try {
    await delay(REQUEST_DELAY);

    console.log("요청 URL:", url);

    const response = await fetch(url);
    const text = await response.text();

    if (response.status === 429) {
      console.error("API 요청 제한: 429 Too Many Requests");
      setBlockUntil();
      return null;
    }

    let data;

    try {
      data = JSON.parse(text);
    } catch (error) {
      console.error("JSON 변환 실패:", text);
      return null;
    }

    console.log("API 응답:", data);

    const header = data?.response?.header;

    if (header && header.resultCode !== "0000") {
      console.error("API 오류:", header.resultMsg);
      return null;
    }

    const items = data?.response?.body?.items?.item;

    if (!items) return [];

    return Array.isArray(items) ? items : [items];
  } catch (error) {
    console.error("API 요청 실패:", error);
    return null;
  }
};

/**
 * 요청을 한 줄로 세워서 실행
 * Promise.all로 많이 불러도 실제 fetch는 하나씩 실행됨
 */
const enqueueRequest = (url) => {
  requestQueue = requestQueue.then(() => getItems(url));
  return requestQueue;
};

/**
 * 캐시를 사용하는 API 요청
 */
const getCachedItems = async (url) => {
  const cacheKey = `travelmap_${url}`;
  const cached = localStorage.getItem(cacheKey);

  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      const now = Date.now();

      if (now - parsed.time < CACHE_TIME) {
        return parsed.data;
      }
    } catch (error) {
      console.error("캐시 읽기 실패:", error);
    }
  }

  const data = await enqueueRequest(url);

  // 429나 오류가 났을 때 기존 캐시가 있으면 기존 캐시 사용
  if (data === null) {
    if (cached) {
      try {
        return JSON.parse(cached).data;
      } catch {
        return [];
      }
    }

    return [];
  }

  localStorage.setItem(
    cacheKey,
    JSON.stringify({
      time: Date.now(),
      data,
    })
  );

  return data;
};

/**
 * 지역 기반 관광정보 조회
 */
export const getTourList = async (
  areaCode = "1",
  contentTypeId = "12",
  rows = 20,
  pageNo = 1
) => {
  const url =
    `${BASE_URL}/areaBasedList2?${commonParams}` +
    `&numOfRows=${rows}` +
    `&pageNo=${pageNo}` +
    `&areaCode=${areaCode}` +
    `&contentTypeId=${contentTypeId}`;

  return await getCachedItems(url);
};

/**
 * 여러 페이지 관광정보 조회
 */
export const getManyTourList = async (
  areaCode = "1",
  contentTypeId = "12",
  rows = 20,
  pages = 1
) => {
  const results = [];

  for (let page = 1; page <= pages; page++) {
    const data = await getTourList(areaCode, contentTypeId, rows, page);
    results.push(...data);
  }

  return results;
};

/**
 * 키워드 검색
 */
export const searchTour = async (keyword, rows = 20, pageNo = 1) => {
  const url =
    `${BASE_URL}/searchKeyword2?${commonParams}` +
    `&numOfRows=${rows}` +
    `&pageNo=${pageNo}` +
    `&keyword=${encodeURIComponent(keyword)}`;

  return await getCachedItems(url);
};

/**
 * 여러 페이지 검색
 */
export const getManySearchTour = async (keyword, rows = 20, pages = 1) => {
  const results = [];

  for (let page = 1; page <= pages; page++) {
    const data = await searchTour(keyword, rows, page);
    results.push(...data);
  }

  return results;
};

/**
 * 위치 기반 관광정보 조회
 */
export const getNearbyTours = async (mapX, mapY, rows = 20, pageNo = 1) => {
  const url =
    `${BASE_URL}/locationBasedList2?${commonParams}` +
    `&numOfRows=${rows}` +
    `&pageNo=${pageNo}` +
    `&mapX=${mapX}` +
    `&mapY=${mapY}` +
    `&radius=30000`;

  return await getCachedItems(url);
};

/**
 * 여러 페이지 위치 기반 조회
 */
export const getManyNearbyTours = async (
  mapX,
  mapY,
  rows = 20,
  pages = 1
) => {
  const results = [];

  for (let page = 1; page <= pages; page++) {
    const data = await getNearbyTours(mapX, mapY, rows, page);
    results.push(...data);
  }

  return results;
};

/**
 * 관광지 상세 정보 조회
 */
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

  const items = await getCachedItems(url);

  return items[0] || null;
};