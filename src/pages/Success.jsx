import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/PaymentConfirmationPage.css";
import { CartContext } from "../contexts/cart.context";

function Success() {
  const navigate = useNavigate();
  const { updateCartCounter } = useContext(CartContext);

  useEffect(() => {
    console.log("Payment successful!");
    // Clear the cart
    updateCartCounter(null, true);
    // Optionally, redirect after a delay
    setTimeout(() => navigate("/"), 5000);
  }, [navigate]);

  return (
    <div className="payment-confirmation-page">
      <h1>✅ Payment Successful!</h1>
      <p>Thank you for your order. Your payment has been processed successfully.</p>
      <p>Redirecting you back home...</p>
    </div>
  );
}

export default Success;
