import EditIcon from "../assets/edit.png";
import LikeIcon from "../assets/like.png";
import DeleteIcon from "../assets/delete.png";

import axios from "axios";
import { API_URL } from "../config/apiConfig.js";

import { Link, useNavigate } from "react-router-dom";
import ImageCarousel from "./ImageCarousel";
import { format } from "date-fns";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

const MealListCard = ({ meal, setGenMessageModal }) => {
  const nav = useNavigate();

  function formatDate(dateToBeFormated) {
    const formattedDate = format(dateToBeFormated, "MMMM d, yyyy, h:mm a");

    return formattedDate;
  }

  function handleDelete() {
    setGenMessageModal((prev) => ({
      ...prev,
      header: "Delete Confirmation",
      message: "Are you sure, you want to Delete the Meal?",
      show: true,
      confirmation: true,
    }));

    //Call Delete API to delete the meal
    /*axios
      .delete(`${API_URL}/api/meals/${meal._id}`)
      .then(() => {
        //Indicate Context API for refresh
        setRefresh((prev) => prev + 1);
        nav("/");
        setToast(`'${meal.title}' was Deleted!`);
      })
      .catch((error) => console.log("Error during meal delete:", error));*/
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
          <Link to={`/handle-meal?mode=Edit&Id=${meal._id}`}>
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
          overlay={<Tooltip id="delete-tooltip">Delete your Meal</Tooltip>}
        >
          <button
            className="meal-list-button"
            onClick={() => {
              handleDelete();
            }}
          >
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
