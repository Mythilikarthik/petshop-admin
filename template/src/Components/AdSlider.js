import React, { useEffect, useState } from "react";

const AdSlider = ({ ads, maxImages, interval, float = false, side = "right" }) => {
  const [index, setIndex] = useState(0);
  const [closed, setClosed] = useState(false); // <-- NEW (for all)

  const visibleAds = ads.slice(0, maxImages);

  useEffect(() => {
    if (visibleAds.length === 0) return;
    const timer = setInterval(() => {
      setIndex(prev => (prev + 1) % visibleAds.length);
    }, interval * 1000);
    return () => clearInterval(timer);
  }, [visibleAds, interval]);

  if (!visibleAds.length || closed) return null; // <-- hides ad if closed

  return (
    <div className={`ad-slider-wrapper ${float ? "floating-ad" : ""} ${side}`}>   

      <div className="ad-slider">
        {/* CLOSE BUTTON (always visible) */}
        <button className="ad-close-btn" onClick={() => setClosed(true)}>
            ×
        </button>
        <a href={visibleAds[index].url || "#"} target="_blank" rel="noopener noreferrer">
          <img src={visibleAds[index].image} className="ad-slide-img" alt="Ad" />
        </a>

        <div className="ad-indicators">
          {visibleAds.map((_, i) => (
            <div
              key={i}
              className={`ad-dot ${i === index ? "active" : ""}`}
              onClick={() => setIndex(i)}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdSlider;
