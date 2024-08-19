import React, { useState } from "react";

function StarRating({ postId, onRatingSubmit, userRating }) {
  const [rating, setRating] = useState(userRating || 0);

  const handleStarClick = (stars) => {
    setRating(stars);
    onRatingSubmit(stars);
  };

  return (
    <div>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{
            cursor: "pointer",
            color: star <= rating ? "gold" : "gray",
          }}
          onClick={() => handleStarClick(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default StarRating;
