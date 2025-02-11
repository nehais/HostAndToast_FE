import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/auth.context";
import { API_URL } from "../config/apiConfig.js";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import "../styles/Cart.css";

const stripePromise = loadStripe(
  "pk_test_51QrOHwRTauKEQKJzmifkduiN3LN9cY5epiFf4LXsbgj6Dpvvk1hTDGY4rwv2bsWgkUYCtMg87lFzsnHr8afgaDbA00LxTg767G"
);

const Cart = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && user._id) {
      console.log("🛠️ Fetching orders for user ID:", user._id);

      const fetchOrders = async () => {
        try {
          const { data } = await axios.get(`${API_URL}/api/orders/user/${user._id}`);
          console.log("✅ Orders fetched successfully:", data);
          setOrders(data);
        } catch (error) {
          console.error("❌ Error fetching the orders:", error.response?.data || error.message);
        }
      };
      fetchOrders();
    } else {
      console.warn("⚠️ No valid user ID found. Skipping order fetch.");
    }
  }, [user]);

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

      console.log("✅ Received Stripe Session ID:", data.id); // Debugging

      const stripe = await stripePromise;
      const result = await stripe.redirectToCheckout({ sessionId: data.id });

      console.log("🚀 Stripe Redirect Result:", result); // Check for errors
    } catch (error) {
      console.error(
        "❌ Error starting checkout:",
        error.response ? error.response.data : error.message
      );
    }
    setLoading(false);
  };

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      {orders.length > 0 ? (
        <ul>
          {orders.map((order) => (
            <li key={order._id}>
              {order.meal.title} - ${order.meal.price} x {order.plates}
            </li>
          ))}
        </ul>
      ) : (
        <p>Your cart is empty.</p>
      )}

      {/* Checkout Button */}
      <button onClick={handleCheckout} disabled={loading}>
        {loading ? "Processing..." : "Proceed to Checkout"}
      </button>
    </div>
  );
};

export default Cart;
