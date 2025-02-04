import EditIcon from "../assets/edit.png";
import LikeIcon from "../assets/like.png";
import DeleteIcon from "../assets/delete.png";

import ImageCarousel from "./ImageCarousel";
import { format } from "date-fns";

const MealListCard = ({ meal }) => {
  function formatDate(dateToBeFormated) {
    const formattedDate = format(dateToBeFormated, "MMMM d, yyyy, h:mm a");

    return formattedDate;
  }

  return (
    <div key={meal._id} className="meal-list-card">
      <ImageCarousel imageUrls={meal.imageUrl} />

      <div className="meal-list-details">
        <p>{meal.cuisine}</p>
        <h4>{meal.title}</h4>
        <p>{meal.price}€</p>
        <p>{formatDate(meal.pickupTime)}</p>
      </div>

      <div className="meal-list-buttons">
        <button className="meal-list-button">
          <img
            src={EditIcon}
            alt="Edit Icon"
            className="meal-list-button-img"
          />
        </button>
        <button className="meal-list-button">
          <img
            src={DeleteIcon}
            alt="Delete Icon"
            className="meal-list-button-img"
          />
        </button>
        <button className="meal-list-button">
          <img
            src={LikeIcon}
            alt="Like Icon"
            className="meal-list-button-img"
          />
        </button>
      </div>
    </div>
  );
};

export default MealListCard;
