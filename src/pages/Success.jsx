import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Success() {
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Payment successful! You can update your order status here.");
    // Optionally, redirect after a delay
    setTimeout(() => navigate("/"), 5000);
  }, [navigate]);

  return (
    <div>
      <h1>✅ Payment Successful!</h1>
      <p>Thank you for your order. Your payment has been processed successfully.</p>
      <p>Redirecting you back home...</p>
    </div>
  );
}

export default Success;
