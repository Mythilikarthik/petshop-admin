import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const StarRating = ({ rating = 0, reviewCount = 0, size = 14 }) => {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<FaStar key={i} size={size} color="#ffb400" />);
    } 
    else if (rating >= i - 0.5) {
      stars.push(<FaStarHalfAlt key={i} size={size} color="#ffb400" />);
    } 
    else {
      stars.push(<FaRegStar key={i} size={size} color="#ddd" />);
    }
  }

  return (
    <div className="d-flex align-items-center gap-1" style={{ maxWidth: "120px", fontSize: "12px" }}>
      {rating > 0 ? (
        <>
          <div className="d-flex gap-1">{stars}</div>

          <span className="fw-semibold">
            {Number(rating).toFixed(1)}
          </span>

          {reviewCount > 0 && (
            <span className="text-muted small">
              · {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
            </span>
          )}
        </>
      ) : (
        <span className="text-muted small fst-italic">
          No reviews yet
        </span>
      )}
    </div>
  );
};

export default StarRating;