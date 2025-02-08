import React, { useState, useEffect } from "react";
import StarRatings from "react-star-ratings";

const StarRating = ({ initialValue = 0, editable = false }) => {
  const [rating, setRating] = useState(initialValue);

  // Ensure rating updates when initialValue changes
  useEffect(() => {
    setRating(initialValue);
  }, [initialValue]);

  return (
    <StarRatings
      rating={rating}
      starRatedColor="#f2cc17"
      changeRating={editable ? setRating : undefined} // Allows editing only when enabled
      numberOfStars={5}
      starDimension="25px"
      starSpacing="3px"
      name="rating"
    />
  );
};

export default StarRating;
