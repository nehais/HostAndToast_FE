import "./App.css";
import { Route, Routes } from "react-router-dom";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import Home from "./pages/Home";
import ProfilePage from "./pages/ProfilePage";
import PageNotFound from "./pages/PageNotFound";
import AllMealsPage from "./pages/AllMealsPage";
import AddMeal from "./pages/AddMeal";
import ShoppingCart from "./pages/ShoppingCart";
import MealList from "./pages/MealList";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import ErrorModal from "./components/ErrorModal";
<<<<<<< HEAD
import CustomSpinner from "./components/CustomSpinner";
=======
import SingleMeal from "./pages/SingleMeal";
>>>>>>> 6432a4583ab104fdf516cfd8b169632b428bbb8e

function App() {
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSpinner, setShowSpinner] = useState(false);
  const [toast, setToast] = useState({ msg: "", type: "" });

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
                <ProfilePage />
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
            path="/add-meal"
            element={
<<<<<<< HEAD
              <AddMeal
                setErrorMessage={setErrorMessage}
                setShowErrorModal={setShowErrorModal}
                setShowSpinner={setShowSpinner}
              />
=======
              <AddMeal setErrorMessage={setErrorMessage} setShowErrorModal={setShowErrorModal} />
>>>>>>> 6432a4583ab104fdf516cfd8b169632b428bbb8e
            }
          />
          <Route path="/meal-list" element={<MealList setToast={setToast} />} />
          <Route path="*" element={<PageNotFound />}></Route>
        </Routes>

        {/* Error Modal */}
        <ErrorModal
          show={showErrorModal}
          handleClose={() => setShowErrorModal(false)}
          errorMessage={errorMessage}
        />

        {/* Spinner */}
        {showSpinner && <CustomSpinner />}
      </div>
      <Footer toast={toast} />
    </div>
  );
}

export default App;
