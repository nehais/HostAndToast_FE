import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/PaymentConfirmationPage.css";
import { CartContext } from "../contexts/cart.context";
import { AuthContext } from "../contexts/auth.context";
import axios from "axios";
import { API_URL } from "../config/apiConfig.js";

function Success() {
  const navigate = useNavigate();
  const { updateCartCounter } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user && user._id) {
      console.log("🛠️ Fetching orders for user ID:", user._id);

      const fetchOrders = async () => {
        try {
          const { data } = await axios.get(
            `${API_URL}/api/orders/user/${user._id}`
          );
          console.log("Orders fetched successfully:", data);
          setOrders(data);
        } catch (error) {
          console.error(
            "Error fetching the orders:",
            error.response?.data || error.message
          );
        }
      };
      fetchOrders();
    } else {
      console.warn("⚠️ No valid user ID found. Skipping order fetch.");
    }
  }, [user]);

  useEffect(() => {
    if (orders.length > 0) {
      console.log("Payment successful!");
      // Clear the cart
      setTimeout(() => updateCartCounter(0, true), 250);

      // Adjust status of orders
      orders.forEach(async (order) => {
        try {
          await axios.put(`${API_URL}/api/orders/${order._id}`, {
            status: "PAID",
          });
        } catch (error) {
          console.error(
            "Error updating order status:",
            error.response?.data || error.message
          );
        }
      });
      // Optionally, redirect after a delay
      setTimeout(() => navigate("/"), 5000);
    }
  }, [orders, navigate]);

  return (
    <div className="payment-confirmation-page">
      <h1>✅ Payment Successful!</h1>
      <p>
        Thank you for your order. Your payment has been processed successfully.
      </p>
      <p>Redirecting you back home...</p>
    </div>
  );
}

export default Success;
