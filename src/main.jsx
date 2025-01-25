import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

import { AuthWrapper } from "./contexts/auth.context";

import { BrowserRouter as Router } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <AuthWrapper>
        <App />
      </AuthWrapper>
    </Router>
  </StrictMode>
);
