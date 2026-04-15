// import React, { useEffect, useState } from "react";

// const AdSlider = ({ ads, maxImages, interval, float = false, side = "right" }) => {
//   const [index, setIndex] = useState(0);
//   const [closed, setClosed] = useState(false); // <-- NEW (for all)

//   const API_BASE =
//   process.env.NODE_ENV === "production"
//     ? process.env.REACT_APP_API_URL
//     : "http://localhost:5000";

//   const visibleAds = ads.slice(0, maxImages);

//   useEffect(() => {
//     if (visibleAds.length === 0) return;
//     const timer = setInterval(() => {
//       setIndex(prev => (prev + 1) % visibleAds.length);
//     }, interval * 1000);
//     return () => clearInterval(timer);
//   }, [visibleAds, interval]);

//   if (!visibleAds.length || closed) return null; // <-- hides ad if closed

//   return (
//     <div className={`ad-slider-wrapper ${float ? "floating-ad" : ""} ${side}`}>   

//       <div className="ad-slider">
//         {/* CLOSE BUTTON (always visible) */}
//         <button className="ad-close-btn" onClick={() => setClosed(true)}>
//             ×
//         </button>
//         <a href={visibleAds[index].url || "#"} target="_blank" rel="noopener noreferrer">
//           <img src={`${API_BASE}/${visibleAds[index].image}`} className="ad-slide-img" alt="Ad" />
//         </a>

//         <div className="ad-indicators">
//           {visibleAds.map((_, i) => (
//             <div
//               key={i}
//               className={`ad-dot ${i === index ? "active" : ""}`}
//               onClick={() => setIndex(i)}
//             ></div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdSlider;

import React, { useEffect, useState } from "react";

const AdSlider = ({ ads, maxImages, interval, float = false, side = "right" }) => {
  const [index, setIndex] = useState(0);
  const [closed, setClosed] = useState(false);

  const API_BASE =
    process.env.NODE_ENV === "production"
      ? process.env.REACT_APP_API_URL
      : "http://localhost:5000";

  const visibleAds = ads.slice(0, maxImages);

  // 🔥 AUTO SLIDER
  useEffect(() => {
    if (!visibleAds.length) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % visibleAds.length);
    }, interval * 1000);

    return () => clearInterval(timer);
  }, [visibleAds, interval]);

  // ✅ IMPRESSION (ONCE PER DAY)
  useEffect(() => {
    if (!visibleAds.length) return;

    const currentAd = visibleAds[index];
    if (!currentAd?._id) return;

    const today = new Date().toDateString();
    let storage = JSON.parse(localStorage.getItem("viewedAdsData") || "{}");

    if (storage.date !== today) {
      storage = { date: today, ads: [] };
    }

    if (storage.ads.includes(currentAd._id)) return;

    fetch(`${API_BASE}/api/ads/${currentAd._id}/impression`, {
      method: "PATCH",
    }).catch(() => {});

    storage.ads.push(currentAd._id);
    localStorage.setItem("viewedAdsData", JSON.stringify(storage));

  }, [index, visibleAds]);

  // ✅ CLICK HANDLER (ONLY ON REAL CLICK)
  const handleAdClick = (ad) => {
    if (!ad?._id) return;

    // Prevent duplicate click in same session (optional)
    const clickedAds = JSON.parse(localStorage.getItem("clickedAds") || "[]");

    if (!clickedAds.includes(ad._id)) {
      fetch(`${API_BASE}/api/ads/${ad._id}/click-track`, {
        method: "PATCH",
      }).catch(() => {});

      clickedAds.push(ad._id);
      localStorage.setItem("clickedAds", JSON.stringify(clickedAds));
    }

    // Open actual URL AFTER tracking
    window.open(ad.url, "_blank");
  };

  if (!visibleAds.length || closed) return null;

  return (
    <div className={`ad-slider-wrapper ${float ? "floating-ad" : ""} ${side}`}>
      <div className="ad-slider">

        {/* CLOSE */}
        <button className="ad-close-btn" onClick={() => setClosed(true)}>
          ×
        </button>

        {/* ✅ CLICK SAFE */}
        <img
          src={`${API_BASE}/${visibleAds[index].image}`}
          className="ad-slide-img"
          alt="Ad"
          style={{ cursor: "pointer" }}
          onClick={() => handleAdClick(visibleAds[index])}
        />

        {/* DOTS */}
        <div className="ad-indicators">
          {visibleAds.map((_, i) => (
            <div
              key={i}
              className={`ad-dot ${i === index ? "active" : ""}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>

      </div>
    </div>
  );
};

export default AdSlider;