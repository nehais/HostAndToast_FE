import { useContext, useState } from "react";
import { CartContext } from "../contexts/cart.context";
import deleteIcon from "../assets/delete.png";
import axios from "axios";
import { API_URL } from "../config/apiConfig.js";
import { useToast } from "../contexts/toast.context.jsx";
import GenModal from "./GenModal.jsx";
import { Link } from "react-router-dom";

const ShoppingCartOrderItem = ({ order, onDelete }) => {
  const { setToast } = useToast();
  const [genMessageModal, setGenMessageModal] = useState({
    header: "",
    message: "",
    show: false,
    confirmation: false,
    orderToDelete: null,
  });
  const { updateCartCounter } = useContext(CartContext);

  const formatDateTime = (isoString, shortWeekday = false) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);

    // Short or full weekday name
    const weekdayFormat = shortWeekday ? "short" : "long";

    // Format the date as "Wed, 20.02.25" or "Wednesday, 20.02.25"
    const formattedDate = `${date.toLocaleDateString("en-GB", {
      weekday: weekdayFormat,
    })}, ${date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    })}`;

    // Format the time as "18:30"
    const formattedTime = date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    return `${formattedDate} at ${formattedTime}`;
  };

  function handleDeleteClick() {
    setGenMessageModal((prev) => ({
      ...prev,
      header: "Delete Confirmation",
      message: "Are you sure you want to delete this order?",
      show: true,
      confirmation: true,
      orderToDelete: order,
    }));
  }

  const deleteMealOrder = (orderToDelete) => {
    axios
      .delete(`${API_URL}/api/orders/${orderToDelete._id}`)
      .then(() => {
        setToast({
          msg: `'${orderToDelete.meal.title}' Order was Deleted!`,
          type: "danger",
        });
        onDelete(orderToDelete._id); // Notify parent to remove the item
        updateCartCounter(-orderToDelete.plates);
      })
      .catch((error) => console.error("Error during order deletion:", error));
  };

  return (
    <div className="shopping-cart-order-item">
      {order === null ? (
        <div className="empty-cart">
          <p>Your cart is empty.</p>
        </div>
      ) : (
        <li>
          <Link to={`/meals/${order.meal._id}`}>
            <img src={order.meal.imageUrl[0]} alt={order.meal.title} />
          </Link>
          <div className="order-info">
            <div className="meal-info">
              <h2>{order.meal.title}</h2>
              <p>{formatDateTime(order.meal.pickupTime, true)}</p>
              <p>
                {order.plates} plate{order.plates > 1 && "s"} per {order.meal.price}€
              </p>
            </div>
            <div className="price-info">
              <h2>
                <span className="price-bold">{order.meal.price * order.plates}€</span>
              </h2>
              <button className="remove-button" onClick={handleDeleteClick}>
                <img src={deleteIcon} alt="Delete" />
              </button>
            </div>
          </div>
        </li>
      )}
      {/* Delete Confirmation || Error Modal */}
      <GenModal
        messageObj={genMessageModal}
        handleClose={() => setGenMessageModal({ ...genMessageModal, show: false })}
        handleAction={() => deleteMealOrder(genMessageModal.orderToDelete)}
      />
    </div>
  );
};

export default ShoppingCartOrderItem;
