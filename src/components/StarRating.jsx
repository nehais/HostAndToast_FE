import React, { useState, useEffect } from "react";
import StarRatings from "react-star-ratings";

const StarRating = ({
  initialValue = 0,
  editable = false,
  small = false,
  onRatingChange,
}) => {
  const [rating, setRating] = useState(initialValue);

  // Ensure rating updates when initialValue changes
  useEffect(() => {
    setRating(initialValue);
  }, [initialValue]);

  const handleRatingChange = (newRating) => {
    if (editable) {
      setRating(newRating);
      if (onRatingChange) {
        onRatingChange(newRating); // Send updated rating to parent
      }
    }
  };

  return (
    <StarRatings
      rating={rating}
      starRatedColor="#f2cc17"
      changeRating={editable ? handleRatingChange : undefined} // Allows editing only when enabled
      numberOfStars={5}
      starDimension={small ? "15px" : "25px"}
      starSpacing="3px"
      name="rating"
    />
  );
};

export default StarRating;
