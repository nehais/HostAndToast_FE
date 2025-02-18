import ProfileIcon from "../assets/profile.png";
import EditIcon from "../assets/edit.png";
import DeleteIcon from "../assets/delete.png";
import EditDisabledIcon from "../assets/edit-disabled.png";
import DeleteDisabledIcon from "../assets/delete-disabled.png";

import axios from "axios";
import { API_URL } from "../config/apiConfig.js";

import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ImageCarousel from "./ImageCarousel";
import { format } from "date-fns";

import GenModal from "./GenModal";
import StarRating from "./StarRating.jsx";
import MealListCustInfo from "./MealListCustInfo.jsx";
import { AuthContext } from "../contexts/auth.context";
import { useToast } from "../contexts/toast.context.jsx";
import { CartContext } from "../contexts/cart.context.jsx";

import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

const MealListCard = ({
  meal,
  active,
  order,
  hideActions,
  setRefreshProfile,
  setShowMeals,
}) => {
  const { setToast } = useToast(); //Use setToast context to set message
  const [isToday, setIsToday] = useState(false);
  const [displayTime, setDisplayTime] = useState("");
  const [comment, setComment] = useState(""); // Comment for order Rating
  const [orderRate, setOrderRate] = useState(0); // Order Rating
  const [mealOrderInfo, setMealOrderInfo] = useState([]); // Order Info
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [genMessageModal, setGenMessageModal] = useState({
    header: "",
    message: "",
    show: false,
    confirmation: false,
  });
  const { profileData } = useContext(AuthContext);
  const nav = useNavigate();

  useEffect(() => {
    //Order Card & Rating available
    if (order && order.rating) setOrderRate(order.rating.stars);
  }, [order]);
  const { updateCartCounter } = useContext(CartContext);

  useEffect(() => {
    if (meal.pickupTime) {
      const date = new Date(meal.pickupTime);
      const today = new Date();

      const isTodayChk =
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();

      if (isTodayChk && active) {
        setIsToday(true);
        setDisplayTime(`Today at ${format(date, "h:mm a")}`);
      } else {
        setDisplayTime(format(date, "MMMM d, yyyy, h:mm a"));
      }
    }
  }, [meal.pickupTime]);

  useEffect(() => {
    getMealOrderInfo();
  }, [meal._id]);

  function handleDeleteClick(e) {
    if (meal.booked) return;
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

  function deleteMealOrder() {
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
          console.log("this is the order", order);
          updateCartCounter(-order.plates);
        })
        .catch((error) => handleError("Error during order deletion:", error));
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
        .catch((error) => handleError("Error during meal deletion:", error));
    }
  }

  const handleRatingClick = (value) => {
    //Order Card & Rating not available so we create
    setOrderRate(value);
    setShowCommentModal(true);
  };

  const submitFeedback = () => {
    createOrderRating();
    setShowCommentModal(false);
    setComment("");
    setTimeout(() => setOrderRate(orderRate), 0);
  };

  function createOrderRating() {
    //Call API to create the Order rating

    if (!orderRate) return;
    const ratingData = {
      stars: orderRate,
      comment: comment,
      meal: meal._id,
      user: profileData._id,
    };

    axios
      .post(`${API_URL}/api/ratings/order/${order._id}`, ratingData)
      .then(() => {
        console.log("Order rated");
      })
      .catch((error) => handleError("Error during rating order:", error));
  }

  function markOrderCompleted() {
    //Call API to create the Order rating

    axios
      .put(`${API_URL}/api/orders/${order._id}`, { status: "FINISHED" })
      .then(() => {
        setToast({
          msg: `'${meal.title}' Order was Completed. Enjoy!`,
          type: "success",
        });
        setRefreshProfile((prev) => prev + 1);
      })
      .catch((error) =>
        handleError("Error during order update to Finished:", error)
      );
  }

  async function startMessaging() {
    try {
      //Create a empty message contact with the Chef
      const emptyMsg = { senderId: profileData._id, receiverId: meal.user._id };
      await axios.post(`${API_URL}/api/messages/empty/`, emptyMsg);

      //Navigate to the Messages & connect to the Chef
      nav(`/messages?recieverId=${meal.user._id}`);
    } catch (error) {
      handleError("Error during rating order:", error);
    }
  }

  const isPickedAvl = () => {
    if (order && active) {
      const currentTime = new Date(); // Get the current date and time
      const pickupTime = new Date(meal.pickupTime); // Convert pickupTime to a Date object
      if (pickupTime < currentTime) {
        return true;
      }
      return false;
    }
    return false;
  };

  function showInMapClicked(lat, long) {
    window.open(
      "https://www.google.com/maps/dir/?api=1&destination=" + lat + "," + long
    );
  }

  function handleError(logMsg, error) {
    console.log(logMsg, error?.response?.data?.message);
    setGenMessageModal({
      header: "Error",
      message: logMsg + error?.response?.data?.message,
      show: true,
    });
  }

  async function getMealOrderInfo() {
    try {
      let { data } = await axios.get(
        `${API_URL}/api/orders/customer/${meal._id}`
      );
      setMealOrderInfo(data);
    } catch (error) {
      handleError("Error during rating order:", error);
    }
  }

  function openCustomers() {
    if (mealOrderInfo.length <= 0) return;

    setGenMessageModal({
      header: "List of Customers",
      message: (
        <div>
          {mealOrderInfo.map((order) => (
            <MealListCustInfo key={order.user._id} user={order.user} />
          ))}
        </div>
      ),
      size: "sm",
      show: true,
      confirmation: false,
    });
  }

  function handleEdit() {
    if (meal.booked) return;
    nav(`/handle-meal?mode=Edit&Id=${meal._id}`);
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
        <p className="meal-list-cuisine">{meal.cuisine}</p>
        <Link to={`/meals/${meal._id}`}>
          <h4 className="meal-card-Hfont">{meal.title}</h4>
        </Link>
        <div>
          {order && (
            <p className="meal-card-font">
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
        <p
          className={
            isToday && active
              ? "meal-card-font is-today-highlight"
              : "meal-card-font"
          }
        >
          {displayTime}
        </p>
      </div>

      {/* Meal description */}
      <div className="meal-list-desc">
        {!order && (
          <>
            <p className="meal-card-font">{meal.price}€ Per Plate</p>
            {active && (
              <>
                <p className="badge bg-success">
                  {meal.plates} Plates Available
                </p>

                <span
                  className={`badge bg-warning ${meal.booked ? "open" : " "}`}
                  onClick={openCustomers}
                >
                  {meal.booked} Plates Booked
                </span>
              </>
            )}
          </>
        )}
        {order && (
          <>
            <div className="meal-chef-details">
              <Link to={`/chef/${meal.user._id}`}>
                <img
                  src={meal.user.imageUrl ? meal.user.imageUrl : ProfileIcon}
                  alt="Chef Icon"
                  className="profile-img meal-list-button"
                />{" "}
              </Link>
              <p className="meal-card-font">
                <strong>Chef</strong> {meal.user.username}
              </p>

              <OverlayTrigger
                placement="right"
                overlay={<Tooltip id="adr-tooltip">Chat with the Chef</Tooltip>}
              >
                <button
                  className="message-button meal-list-button"
                  onClick={startMessaging}
                ></button>
              </OverlayTrigger>
            </div>

            {active && (
              <>
                <div className="meal-chef-details">
                  <input
                    type="text"
                    name="chefAddress"
                    disabled={true}
                    value={meal.user.address.displayName}
                    className="chef-adr"
                  />
                </div>
              </>
            )}
          </>
        )}
        {order && hideActions && (
          <>
            {/* Rate the Order */}
            {!order.rating && !orderRate && (
              <p className="badge bg-warning">Tap to Rate</p>
            )}
            <div className={orderRate > 0 ? "" : "tooltip-rating"}>
              <StarRating
                initialValue={orderRate}
                onRatingChange={handleRatingClick}
                editable={order.rating || orderRate ? false : true}
                small={true}
              />
            </div>
          </>
        )}
      </div>

      {/* Meal List Buttons */}
      <div className="meal-list-buttons">
        {/* Mark Order Completed Button */}
        {isPickedAvl() && (
          <OverlayTrigger
            placement="right"
            overlay={
              <Tooltip id="adr-tooltip">Mark the order as completed</Tooltip>
            }
          >
            <button
              className="pickup-button meal-list-button"
              onClick={markOrderCompleted}
            ></button>
          </OverlayTrigger>
        )}
        {/* Address Navigation Button */}
        {order && active && (
          <OverlayTrigger
            placement="right"
            overlay={
              <Tooltip id="adr-tooltip">
                Open the Address navigation to the Chef
              </Tooltip>
            }
          >
            <button
              className="adr-nav-button meal-list-button"
              onClick={() =>
                showInMapClicked(meal.user.address.lat, meal.user.address.long)
              }
            ></button>
          </OverlayTrigger>
        )}
        {/* Edit Button */}
        <OverlayTrigger
          placement="right"
          overlay={
            <Tooltip id="edit-tooltip">
              {meal.booked ? "Booked Meal cannot be edited" : "Edit your Meal"}
            </Tooltip>
          }
        >
          <button
            hidden={hideActions || order ? true : false}
            className={`meal-list-button ${
              meal.booked ? " disabled-button" : ""
            }`}
            onClick={handleEdit}
          >
            <img
              src={meal.booked ? EditDisabledIcon : EditIcon}
              alt="Edit Icon"
              className="meal-list-button-img"
            />
          </button>
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
            className={`meal-list-button ${
              meal.booked ? " disabled-button" : ""
            }`}
            onClick={() => {
              handleDeleteClick();
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
        handleAction={deleteMealOrder}
      />

      {/* Comment Modal */}
      <GenModal
        messageObj={{
          header: "Leave a Comment",
          message: (
            <>
              <p>You've given {orderRate} stars. Want to add a comment?</p>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your feedback..."
                className="comment-box"
              />
            </>
          ),
          show: showCommentModal,
          confirmation: true,
        }}
        handleClose={() => {
          setComment("");
          setTimeout(() => setOrderRate(0), 0);
          setShowCommentModal(false);
        }}
        handleAction={submitFeedback}
      />
    </div>
  );
};

export default MealListCard;
