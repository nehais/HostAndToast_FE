import EditIcon from "../assets/edit.png";
import DeleteIcon from "../assets/delete.png";
import EditDisabledIcon from "../assets/edit-disabled.png";
import DeleteDisabledIcon from "../assets/delete-disabled.png";

import axios from "axios";
import { API_URL } from "../config/apiConfig.js";

import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ImageCarousel from "./ImageCarousel";
import { format } from "date-fns";

import StarRating from "../components/StarRating.jsx";

import GenModal from "./GenModal";
import { AuthContext } from "../contexts/auth.context";
import { useToast } from "../contexts/toast.context.jsx";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

const MealListCard = ({
  meal,
  active,
  order,
  deleteDisabled,
  hideActions,
  setRefreshProfile,
  setShowMeals,
}) => {
  const [orderRate, setOrderRate] = useState(0);
  const { setToast } = useToast(); //Use setToast context to set message
  const [genMessageModal, setGenMessageModal] = useState({
    header: "",
    message: "",
    show: false,
    confirmation: false,
  });
  const { profileData } = useContext(AuthContext);

  useEffect(() => {
    //Order Card & Rating not available so we create
    if (order && !order.rating) onOrderRated(orderRate);
  }, [orderRate]);

  useEffect(() => {
    //Order Card & Rating available
    if (order && order.rating) setOrderRate(order.rating.stars);
  }, [order]);

  function formatDate(dateToBeFormated) {
    const formattedDate = format(dateToBeFormated, "MMMM d, yyyy, h:mm a");

    return formattedDate;
  }

  function onDelete() {
    if (order) {
      //Call Delete API to delete the order
      axios
        .delete(`${API_URL}/api/orders/${order._id}`)
        .then(() => {
          setToast({
            msg: `'${meal.title}' Order was Deleted!`,
            type: "danger",
          });
          setRefreshProfile((prev) => prev + 1);
          setShowMeals((prev) => !prev);
        })
        .catch((error) => console.log("Error during order delete:", error));
    } else {
      //Call Delete API to delete the meal
      axios
        .delete(`${API_URL}/api/meals/${meal._id}`)
        .then(() => {
          setToast({
            msg: `'${meal.title}' Meal was Deleted!`,
            type: "danger",
          });
        })
        .catch((error) => console.log("Error during meal delete:", error));
    }
  }

  function onOrderRated(stars) {
    if (!stars) return;
    const ratingData = {
      stars: stars,
      comment: "",
      meal: meal._id,
      user: profileData._id,
    };
    axios
      .post(`${API_URL}/api/ratings/order/${order._id}`, ratingData)
      .then(() => {
        console.log("Order rated");
      })
      .catch((error) => console.log("Error during rating order:", error));
  }

  function handleDelete(e) {
    let message = "Are you sure, you want to Delete the Meal?";

    if (order) {
      message = "Are you sure, you want to Delete the Order?";
    }

    //Check for Delete Confirmation
    setGenMessageModal((prev) => ({
      ...prev,
      header: "Delete Confirmation",
      message: message,
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
        <div>
          {order && (
            <p>
              {meal.price * order.plates}€ for {order.plates} Plates
            </p>
          )}
          {!order && (
            <StarRating
              initialValue={meal.mealRating ? meal.mealRating : 0}
              editable={false}
              small={true}
            />
          )}
        </div>
        <p>{formatDate(meal.pickupTime)}</p>
      </div>

      {/* Meal description */}
      <div className="meal-list-desc">
        {!order && (
          <>
            <p>{meal.price}€ Per Plate</p>
            {active && (
              <>
                <p className="badge bg-success">
                  {meal.plates} Plates Available
                </p>

                <span className="badge bg-warning">
                  {meal.booked} Plates Booked
                </span>
              </>
            )}
          </>
        )}
        {order && hideActions && (
          <>
            {/* Rate the Order */}
            {!order.rating && <p>Tap to Rate</p>}
            <div className={orderRate > 0 ? "" : "tooltip-rating"}>
              <StarRating
                initialValue={orderRate}
                onRatingChange={setOrderRate}
                editable={order.rating ? false : true}
                small={true}
              />
            </div>
          </>
        )}
      </div>

      {/* Meal List Buttons */}
      <div className="meal-list-buttons">
        {/* Edit Button */}
        <OverlayTrigger
          placement="right"
          overlay={
            <Tooltip id="edit-tooltip">
              {meal.booked ? "Booked Meal cannot be edited" : "Edit your Meal"}
            </Tooltip>
          }
        >
          <Link to={`/handle-meal?mode=Edit&Id=${meal._id}`}>
            <button
              hidden={hideActions || order ? true : false}
              className="meal-list-button"
            >
              <img
                src={meal.booked ? EditDisabledIcon : EditIcon}
                alt="Edit Icon"
                className="meal-list-button-img"
              />
            </button>
          </Link>
        </OverlayTrigger>
        {/* Delete Button */}
        <OverlayTrigger
          placement="right"
          overlay={
            <Tooltip id="delete-tooltip">
              {meal.booked
                ? "Booked Meal cannot be deleted"
                : "Delete your Meal"}
            </Tooltip>
          }
        >
          <button
            hidden={hideActions}
            className="meal-list-button"
            onClick={() => {
              handleDelete();
            }}
          >
            <img
              src={meal.booked ? DeleteDisabledIcon : DeleteIcon}
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
