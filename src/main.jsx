import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

import { AuthWrapper } from "./contexts/auth.context";
import { AddressWrapper } from "./contexts/address.context.jsx";

import { BrowserRouter as Router } from "react-router-dom";
import { CartWrapper } from "./contexts/cart.context.jsx";
import { ToastProviderWrapper } from "./contexts/toast.context.jsx";
import { MessageProviderWrapper } from "./contexts/message.context.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <AuthWrapper>
        <ToastProviderWrapper>
          <AddressWrapper>
            <MessageProviderWrapper>
              <CartWrapper>
                <App />
              </CartWrapper>
            </MessageProviderWrapper>
          </AddressWrapper>
        </ToastProviderWrapper>
      </AuthWrapper>
    </Router>
  </StrictMode>
);
