import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

import { AuthWrapper } from "./contexts/auth.context";
import { AddressWrapper } from "./contexts/address.context.jsx";

import { BrowserRouter as Router } from "react-router-dom";
import { CartWrapper } from "./contexts/cart.context.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <AuthWrapper>
        <AddressWrapper>
          <CartWrapper>
            <App />
          </CartWrapper>
        </AddressWrapper>
      </AuthWrapper>
    </Router>
  </StrictMode>
);
