import { Link } from "react-router-dom";

const ShoppingCartOrderItem = ({ order }) => {
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

  return (
    <div className="shopping-cart-order-item">
      {order === null ? (
        <div className="empty-cart">
          <p>Your cart is empty.</p>
        </div>
      ) : (
        <li>
          <Link to={`/meals/${order.meal._id}`}>
            <img src={order.meal.imageUrl} alt={order.meal.title} />
          </Link>
          <div className="order-info">
            <div className="meal-info">
              <h2>{order.meal.title}</h2>
              <h2>
                <span className="price-bold">{order.meal.price * order.plates}€</span>
              </h2>
            </div>
            <p> {formatDateTime(order.meal.pickupTime, true)}</p>
            <p>
              {order.plates} plate{order.plates > 1 && "s"} per {order.meal.price}€
            </p>
          </div>
        </li>
      )}
    </div>
  );
};
export default ShoppingCartOrderItem;
