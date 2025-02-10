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
import MealList from "./pages/MealList";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import CustomSpinner from "./components/CustomSpinner";
import SingleMeal from "./pages/SingleMeal";
import CookOverviewPage from "./pages/CookOverviewPage";

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
          <Route path="/cook/:cookId" element={<CookOverviewPage />} />

          <Route
            path="/meal-list"
            element={
              <PrivateRoute>
                <MealList />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<PageNotFound />}></Route>
        </Routes>

        {/* Spinner */}
        {showSpinner && <CustomSpinner />}
      </div>
      <Footer />
    </div>
  );
}

export default App;
