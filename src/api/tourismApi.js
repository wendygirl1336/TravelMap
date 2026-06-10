/**
 * 한국관광공사 관광정보 API
 * 429 요청 제한 방지 버전
 * 기능 유지 / 전체 데이터 유지
 */

const API_KEY =
  "ce2c63d01d0c3c319049a74dbf5019beda9d02708c00112e758384d0d7b09b1a";

const BASE_URL = "https://apis.data.go.kr/B551011/KorService2";

const commonParams =
  `serviceKey=${API_KEY}` +
  `&MobileOS=ETC` +
  `&MobileApp=TravelMap` +
  `&_type=json`;

const CACHE_TIME = 1000 * 60 * 60 * 12;
const REQUEST_DELAY = 1200;

let requestQueue = Promise.resolve();

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getItems = async (url) => {
  try {
    await delay(REQUEST_DELAY);

    console.log("요청 URL:", url);

    const response = await fetch(url);
    const text = await response.text();

    if (response.status === 429) {
      console.error("API 요청 제한: 429 Too Many Requests");
      return null;
    }

    if (response.status === 401) {
      console.error("API 인증 실패: 401 Unauthorized");
      console.error(text);
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

const enqueueRequest = (url) => {
  requestQueue = requestQueue.then(() => getItems(url));
  return requestQueue;
};

const getCachedItems = async (url) => {
  const cacheKey = `travelmap_${url}`;
  const cached = localStorage.getItem(cacheKey);

  if (cached) {
    try {
      const parsed = JSON.parse(cached);

      if (Date.now() - parsed.time < CACHE_TIME) {
        return parsed.data;
      }
    } catch (error) {
      console.error("캐시 읽기 실패:", error);
    }
  }

  const data = await enqueueRequest(url);

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

export const searchTour = async (keyword, rows = 20, pageNo = 1) => {
  const url =
    `${BASE_URL}/searchKeyword2?${commonParams}` +
    `&numOfRows=${rows}` +
    `&pageNo=${pageNo}` +
    `&keyword=${encodeURIComponent(keyword)}`;

  return await getCachedItems(url);
};

export const getManySearchTour = async (keyword, rows = 20, pages = 1) => {
  const results = [];

  for (let page = 1; page <= pages; page++) {
    const data = await searchTour(keyword, rows, page);
    results.push(...data);
  }

  return results;
};

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