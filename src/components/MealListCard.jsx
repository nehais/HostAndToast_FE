import EditIcon from "../assets/edit.png";
import DeleteIcon from "../assets/delete.png";

import axios from "axios";
import { API_URL } from "../config/apiConfig.js";

import { Link, useNavigate } from "react-router-dom";
import ImageCarousel from "./ImageCarousel";
import { format } from "date-fns";

import GenModal from "./GenModal";
import { useToast } from "../contexts/toast.context.jsx";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { useState } from "react";

const MealListCard = ({ meal, active }) => {
  const nav = useNavigate();
  const { setToast } = useToast(); //Use setToast context to set message
  const [genMessageModal, setGenMessageModal] = useState({
    header: "",
    message: "",
    show: false,
    confirmation: false,
  });

  function formatDate(dateToBeFormated) {
    const formattedDate = format(dateToBeFormated, "MMMM d, yyyy, h:mm a");

    return formattedDate;
  }

  function onDelete() {
    //Call Delete API to delete the meal
    axios
      .delete(`${API_URL}/api/meals/${meal._id}`)
      .then(() => {
        nav("/");
        setToast({ msg: `'${meal.title}' Meal was Deleted!`, type: "danger" });
      })
      .catch((error) => console.log("Error during meal delete:", error));
  }

  function handleDelete() {
    //Check for Delete Confirmation
    setGenMessageModal((prev) => ({
      ...prev,
      header: "Delete Confirmation",
      message: "Are you sure, you want to Delete the Meal?",
      show: true,
      confirmation: true,
    }));
  }

  return (
    <div
      key={meal._id}
      className={`meal-list-card ${
        active ? "meal-list-card-active" : "meal-list-card-inactive"
      }`}
    >
      {/* Image Carousel to display multiple images */}
      <ImageCarousel imageUrls={meal.imageUrl} />

      {/* Meal info details */}
      <div className="meal-list-details">
        <p>{meal.cuisine}</p>
        <h4>{meal.title}</h4>
        <p>{meal.price}€</p>
        <p>{formatDate(meal.pickupTime)}</p>
      </div>

      {/* Meal description */}
      <div className="meal-list-desc">
        <p className="meal-list-desc">{meal.description}</p>
      </div>

      {/* Meal List Buttons */}
      <div className="meal-list-buttons">
        {/* Edit Button */}
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
        {/* Delete Button */}
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
        </OverlayTrigger>{" "}
      </div>

      {/* Delete Confirmation || Error Modal */}
      <GenModal
        messageObj={genMessageModal}
        handleClose={(prev) => setGenMessageModal({ ...prev, show: false })}
        handleAction={onDelete}
      />
    </div>
  );
};

export default MealListCard;
