import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/auth.context";
import { API_URL } from "../config/apiConfig.js";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import "../styles/ShoppingCart.css";
import ShoppingCartOrderItem from "../components/ShoppingCartOrderItem.jsx";

const stripePromise = loadStripe(
  "pk_test_51QrOHwRTauKEQKJzmifkduiN3LN9cY5epiFf4LXsbgj6Dpvvk1hTDGY4rwv2bsWgkUYCtMg87lFzsnHr8afgaDbA00LxTg767G"
);

const ShoppingCart = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (user && user._id) {
      console.log("🛠️ Fetching orders for user ID:", user._id);

      const fetchOrders = async () => {
        try {
          const { data } = await axios.get(`${API_URL}/api/orders/user/${user._id}`);
          console.log("Orders fetched successfully:", data);
          const ordersToShow = data.filter((order) => order.status === "RESERVED");
          setOrders(ordersToShow);
        } catch (error) {
          console.error("Error fetching the orders:", error.response?.data || error.message);
        }
      };
      fetchOrders();
    } else {
      console.warn("⚠️ No valid user ID found. Skipping order fetch.");
    }
  }, [user]);

  useEffect(() => {
    const total = orders.reduce((acc, order) => acc + order.meal.price * order.plates, 0);
    setTotal(total);
  }, [orders]);

  const handleDeleteOrder = (orderId) => {
    // Update orders by removing the deleted order
    setOrders(orders.filter((order) => order._id !== orderId));
  };

  const handleCheckout = async () => {
    if (!orders.length) {
      alert("Your cart is empty!");
      return;
    }

    console.log("Sending Checkout Request:", orders);

    setLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/api/payment/create-checkout-session`, {
        items: orders.map((order) => ({
          name: order.meal.title,
          price: order.meal.price,
          quantity: order.plates,
        })),
      });

      console.log("Received Stripe Session ID:", data.id); // Debugging

      const stripe = await stripePromise;
      const result = await stripe.redirectToCheckout({ sessionId: data.id });

      console.log("Stripe Redirect Result:", result); // Check for errors
    } catch (error) {
      console.error(
        "Error starting checkout:",
        error.response ? error.response.data : error.message
      );
    }
    setLoading(false);
  };

  return (
    <div className="page-container">
      <div className="shopping-cart-container">
        <h1>{user.username}s Shopping Cart</h1>
        <div className="shopping-cart">
          <div>
            {orders.length > 0 ? (
              <ul>
                {orders.map((order) => (
                  <ShoppingCartOrderItem
                    key={order._id}
                    order={order}
                    onDelete={handleDeleteOrder} // Pass delete handler
                  />
                ))}
              </ul>
            ) : (
              <ShoppingCartOrderItem order={null} />
            )}
          </div>
          {orders.length > 0 && (
            <div className="shopping-cart-total">
              <div className="total">
                <h2>Total:</h2>
                <p>
                  <span className="price-bold">{total}€</span>
                </p>
              </div>
              {/* Checkout Button */}
              <button onClick={handleCheckout} disabled={loading} className="checkout-button">
                {loading ? "Processing..." : "Checkout"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
