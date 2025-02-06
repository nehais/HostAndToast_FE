import EditIcon from "../assets/edit.png";
import LikeIcon from "../assets/like.png";
import DeleteIcon from "../assets/delete.png";

import ImageCarousel from "./ImageCarousel";
import { format } from "date-fns";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { Link } from "react-router-dom";

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

      <div className="meal-list-desc">
        <p className="meal-list-desc">{meal.description}</p>
      </div>

      <div className="meal-list-buttons">
        <OverlayTrigger
          placement="right"
          overlay={<Tooltip id="edit-tooltip">Edit your Meal</Tooltip>}
        >
          <Link to="/add-meal?mode=Edit">
            <button className="meal-list-button">
              <img
                src={EditIcon}
                alt="Edit Icon"
                className="meal-list-button-img"
              />
            </button>
          </Link>
        </OverlayTrigger>

        <OverlayTrigger
          placement="right"
          overlay={<Tooltip id="edit-tooltip">Delete your Meal</Tooltip>}
        >
          <button className="meal-list-button">
            <img
              src={DeleteIcon}
              alt="Delete Icon"
              className="meal-list-button-img"
            />
          </button>
        </OverlayTrigger>

        <OverlayTrigger
          placement="right"
          overlay={
            <Tooltip id="edit-tooltip">Mark this Meal as Favourite</Tooltip>
          }
        >
          <button className="meal-list-button">
            <img
              src={LikeIcon}
              alt="Like Icon"
              className="meal-list-button-img"
            />
          </button>
        </OverlayTrigger>
      </div>
    </div>
  );
};

export default MealListCard;
