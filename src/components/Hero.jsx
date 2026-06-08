import { useState } from "react";

function Hero({ tours, onDetail }) {
  const [current, setCurrent] = useState(0);

  const defaultImages = [
    {
      title: "TravelMap",
      addr1: "여행지를 한눈에",
      firstimage:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    },
    {
      title: "국내 여행 추천",
      addr1: "가고 싶은 여행지를 검색해보세요",
      firstimage:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    },
    {
      title: "나만의 여행 지도",
      addr1: "관광지, 맛집, 축제를 한 번에 확인하세요",
      firstimage:
        "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1",
    },
  ];

  const slideData = tours.length > 0 ? tours : defaultImages;
  const currentTour = slideData[current];

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slideData.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slideData.length - 1 : prev - 1));
  };

  return (
    <section className="hero">
      <img src={currentTour.firstimage} alt={currentTour.title} />

      <div className="hero-overlay"></div>

      <button className="hero-arrow left" onClick={prevSlide}>
        ‹
      </button>

      <button className="hero-arrow right" onClick={nextSlide}>
        ›
      </button>

      <div className="hero-text">
        <span>추천 여행지</span>
        <h2>{currentTour.title}</h2>
        <p>{currentTour.addr1 || "주소 정보 없음"}</p>

        {currentTour.contentid && (
          <button onClick={() => onDetail(currentTour)}>자세히 보기</button>
        )}
      </div>

      <div className="hero-dots">
        {slideData.map((_, index) => (
          <span
            key={index}
            className={index === current ? "dot active" : "dot"}
            onClick={() => setCurrent(index)}
          ></span>
        ))}
      </div>
    </section>
  );
}

export default Hero;