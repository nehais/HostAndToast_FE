import "../styles/AddUpdMeal.css";
import SpoonIcon from "../assets/spoon.png";
import ReuseIcon from "../assets/reuse.png";

import axios from "axios";
import { API_URL } from "../config/apiConfig.js";

import { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import GenModal from "../components/GenModal";
import { AuthContext } from "../contexts/auth.context.jsx";
import { useToast } from "../contexts/toast.context.jsx";

import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import SidePrevMeals from "../components/SidePrevMeals.jsx";
import MealForm from "../components/MealForm.jsx";

const AddUpdMeal = ({ setShowSpinner }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const mode = searchParams.get("mode"); //Check if newly created book
  const Id = searchParams.get("Id");
  const [imgError, setImgError] = useState(false);
  const [mealFormData, setMealFormData] = useState({
    title: "",
    cuisine: "Others",
    description: "",
    imageUrl: [],
    allergies: [],
    plates: 1,
    pickupTime: "",
    hosted: false,
    price: 1,
    user: "",
  });
  const [meals, setMeals] = useState([]);
  const [useMealID, setUseMealID] = useState("");
  const { profileData } = useContext(AuthContext);
  const nav = useNavigate();
  const { setToast } = useToast(); //Use setToast context to set message
  const [genMessageModal, setGenMessageModal] = useState({
    header: "",
    message: "",
    show: false,
    confirmation: false,
  });

  useEffect(() => {
    //Display the meal address as the user address
    setMealFormData((prev) => {
      return { ...prev, user: profileData._id };
    });

    //Make sure the Address is entered for the User before posting the Meal
    if (profileData && profileData._id && !profileData.address._id) {
      nav("/profile");
      setToast({
        msg: "Please enter the address to post a Meal",
        type: "danger",
      });
    }
  }, [profileData]);

  // Fetch the meal data
  useEffect(() => {
    if (!Id) return;

    const getMeal = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/meals/${Id}`);
        useMeal(data);
      } catch (error) {
        console.log("Error fetching meal", error.response.data.message);
      }
    };
    getMeal();
  }, [Id]);

  function handleError(logMsg, error) {
    console.log(logMsg, error?.response?.data?.message);
    setGenMessageModal({
      header: "Error",
      message: logMsg + error?.response?.data?.message,
      show: true,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (mealFormData.imageUrl.length === 0) {
      //Missing meal image validation
      setImgError(true);

      let errorTimeout = setTimeout(() => {
        setImgError(false);
        clearTimeout(errorTimeout);
      }, 5000);
      return;
    }

    if (useMealID) {
      updateMeal(); //There is mealID so we update the meal
    } else {
      addNewMeal(); //There is no mealID so add the meal
    }
  }

  //Updated an existing User meal
  async function updateMeal() {
    try {
      setShowSpinner((prev) => !prev); //Show custom spinner during update Meal
      const updatedMeal = await axios.put(
        `${API_URL}/api/meals/${useMealID}`,
        mealFormData
      );

      setShowSpinner((prev) => !prev);
      console.log("Meal updated", updatedMeal);
      nav("/all-meals");
    } catch (error) {
      setShowSpinner((prev) => !prev);
      handleError("Update Meal Error: ", error);
    }
  }

  //Creates a new User meal
  async function addNewMeal() {
    try {
      setShowSpinner((prev) => !prev); //Show custom spinner during add Meal
      const newMeal = await axios.post(`${API_URL}/api/meals`, mealFormData);

      setShowSpinner((prev) => !prev);
      console.log("Meal updated", newMeal);
      nav("/all-meals");
    } catch (error) {
      setShowSpinner((prev) => !prev);
      handleError("Add Meal Error: ", error);
    }
  }

  //Gets all meals for the User
  async function getUserMeals() {
    try {
      setShowSpinner((prev) => !prev); //Show custom spinner during the fetch
      const { data } = await axios.get(
        `${API_URL}/api/meals/user/${profileData._id}`
      );

      setShowSpinner((prev) => !prev);
      console.log("All User Meals fetched", data);
      setMeals(data);
    } catch (error) {
      setShowSpinner((prev) => !prev);
      handleError("Error fetching meals: ", error);
    }
  }

  const formatDateTimeLocal = (date) => {
    return new Date(date).toISOString().slice(0, 16); // Removes seconds and timezone
  };

  //Use an Older Meal
  function useMeal(meal) {
    setUseMealID(meal._id);

    const currentTime = new Date(); // Get the current date and time
    let pickupTime;
    if (meal.pickupTime) {
      pickupTime =
        new Date(meal.pickupTime) < currentTime
          ? formatDateTimeLocal(currentTime)
          : formatDateTimeLocal(meal.pickupTime);
    }

    setMealFormData({
      title: meal.title || "",
      cuisine: meal.cuisine || "",
      description: meal.description || "",
      imageUrl: meal.imageUrl || [],
      allergies: meal.allergies || [],
      plates: meal.plates || 1,
      pickupTime: pickupTime || "",
      hosted: false,
      price: meal.price || 1,
    });
  }

  return (
    <div className="add-meal-container">
      <SidePrevMeals mode={mode} meals={meals} useMeal={useMeal} />

      <section className="meal-form-container">
        <div className="meal-form-header">
          <div>
            <h2 className="meal-form-heading">Meal Details</h2>
            <img src={SpoonIcon} alt="" className="add-spoon-img" />
          </div>

          {mode !== "Edit" && (
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id="register-tooltip">
                  Load your older meals to re-create the creation.
                </Tooltip>
              }
            >
              <button
                className="load-prevmeal-button add-meal-button"
                onClick={() => getUserMeals()}
              >
                <img src={ReuseIcon} alt="" className="reuse-img" />
                Load Previous Meals
              </button>
            </OverlayTrigger>
          )}
        </div>

        <MealForm
          useMealID={useMealID}
          setUseMealID={setUseMealID}
          mealFormData={mealFormData}
          setMealFormData={setMealFormData}
          handleSubmit={handleSubmit}
          handleError={handleError}
          setShowSpinner={setShowSpinner}
          imgError={imgError}
        />
      </section>

      {/* Error Modal */}
      <GenModal
        messageObj={genMessageModal}
        handleClose={(prev) => setGenMessageModal({ ...prev, show: false })}
      />
    </div>
  );
};

export default AddUpdMeal;
