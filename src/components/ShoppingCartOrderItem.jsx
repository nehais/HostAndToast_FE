import { Link } from "react-router-dom";

const ShoppingCartOrderItem = ({ order }) => {
  return (
    <div className="shopping-cart-order-item">
      <li>
        <Link to={`/meals/${order.meal._id}`}>
          <img src={order.meal.imageUrl} alt={order.meal.title} />
        </Link>
        <div>
          <h2>{order.meal.title}</h2>
          <p>
            {order.plates} plate{order.plates > 1 && "s"} per {order.meal.price}€
          </p>
          <p>
            <span>Total: {order.meal.price * order.plates}€</span>
          </p>
        </div>
      </li>
    </div>
  );
};
export default ShoppingCartOrderItem;
