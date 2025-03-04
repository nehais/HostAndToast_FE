import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/PaymentConfirmationPage.css";

function Cancel() {
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Payment was canceled.");
    // Redirect after a delay
    setTimeout(() => navigate("/cart"), 5000);
  }, [navigate]);

  return (
    <div className="payment-confirmation-page">
      <h1>❌ Payment Canceled</h1>
      <p>Your payment was canceled. You can try again or continue browsing.</p>
      <p>Redirecting back to cart...</p>
    </div>
  );
}

export default Cancel;
