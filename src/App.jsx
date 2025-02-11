import "./App.css";
import { Route, Routes } from "react-router-dom";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import Home from "./pages/Home";
import ProfilePage from "./pages/ProfilePage";
import PageNotFound from "./pages/PageNotFound";
import AllMealsPage from "./pages/AllMealsPage";
import AddUpdMeal from "./pages/AddUpdMeal";
import ShoppingCart from "./pages/ShoppingCart";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import CustomSpinner from "./components/CustomSpinner";
import SingleMeal from "./pages/SingleMeal";
import ChefOverviewPage from "./pages/ChefOverviewPage";
import Cart from "./pages/Cart";
import Success from "./pages/Success"; // Import Success Page
import Cancel from "./pages/Cancel"; // Import Cancel Page

function App() {
  const [showSpinner, setShowSpinner] = useState(false);

  return (
    <div className="App">
      <Navbar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/all-meals" element={<AllMealsPage />} />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage setShowSpinner={setShowSpinner} />
              </PrivateRoute>
            }
          />
          <Route path="/meals/:mealId" element={<SingleMeal />} />
          <Route
            path="/shopping-cart"
            element={
              <PrivateRoute>
                <ShoppingCart />
              </PrivateRoute>
            }
          />
          <Route
            path="/handle-meal/"
            element={
              <PrivateRoute>
                <AddUpdMeal setShowSpinner={setShowSpinner} />
              </PrivateRoute>
            }
          />
          <Route path="/chef/:chefId" element={<ChefOverviewPage />} />
          <Route path="/cart" element={<Cart />} />

          {/* ✅ Payment Success and Cancel Routes */}
          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<Cancel />} />

          {/* 404 - Page Not Found */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>

        {/* Spinner */}
        {showSpinner && <CustomSpinner />}
      </div>
      <Footer />
    </div>
  );
}

export default App;
