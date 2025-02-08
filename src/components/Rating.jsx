import "../styles/Rating.css";
import StarRating from "../components/StarRating";
import profileImage from "../assets/profile.png";

const Rating = ({ rating }) => {
  return (
    <div className="rating">
      <div className="rating-user">
        <img
          src={rating.user.imageUrl ? rating.user.imageUrl : profileImage}
          className={!rating.user.imageUrl ? "default-image" : ""}
        />

        <div>
          <h3>{rating.user.username}</h3>
          <StarRating initialValue={rating.stars} editable={false} />
        </div>
      </div>
      <div>
        <p>{rating.comment}</p>
      </div>
    </div>
  );
};
export default Rating;
