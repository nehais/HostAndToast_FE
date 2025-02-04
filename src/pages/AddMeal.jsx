import "../styles/AddUpdMeal.css";
import SpoonIcon from "../assets/spoon.png";
import ReuseIcon from "../assets/reuse.png";

import axios from "axios";
import { API_URL } from "../config/apiConfig.js";

import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddressSearch from "../components/AddressSearch.jsx";
import PrevMealCard from "../components/PrevMealCard.jsx";
import { AuthContext } from "../contexts/auth.context.jsx";

import Select from "react-select";
import { Dropdown } from "react-bootstrap";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

const AddMeal = ({ setErrorMessage, setShowErrorModal }) => {
  const [sideBarOpen, setSideBarOpen] = useState(true);
  const [imgError, setImgError] = useState(false);
  const [mealFormData, setMealFormData] = useState({
    title: "",
    cuisine: "",
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

  useEffect(() => {
    //Display the meal address as the user address
    setMealFormData((prev) => {
      return { ...prev, user: profileData._id };
    });
  }, [profileData]);

  function handleError(logMsg, error) {
    console.log(logMsg, error?.response?.data?.message);
    setErrorMessage(logMsg + error?.response?.data?.message);
    setShowErrorModal(true);
  }

  function handleChange(e) {
    //Form change value
    setMealFormData((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
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

  async function handleImageUpload(e) {
    //prevent the form from reloading
    e.preventDefault();

    const addImages = Array.from(e.target.files);

    //create formData for multer on the server
    const myFormData = new FormData();
    addImages.forEach((image) => {
      myFormData.append("imageUrl", image);
    });

    try {
      const { data } = await axios.post(
        `${API_URL}/api/multiple-uploads`,
        myFormData
      );
      console.log("image uploaded successfully", data);

      setMealFormData((prev) => {
        const updatedImageUrls = [...prev.imageUrl, ...data.imageUrls];
        return { ...prev, imageUrl: updatedImageUrls };
      });
    } catch (error) {
      handleError("File upload failed: ", error);
    }
  }

  //Updated an existing User meal
  async function updateMeal() {
    try {
      const updatedMeal = await axios.put(
        `${API_URL}/api/meals/${useMealID}`,
        mealFormData
      );
      console.log("Meal updated", updatedMeal);
      nav("/all-meals");
    } catch (error) {
      handleError("Update Meal Error: ", error);
    }
  }

  //Creates a new User meal
  async function addNewMeal() {
    try {
      const newMeal = await axios.post(`${API_URL}/api/meals`, mealFormData);
      console.log("Meal updated", newMeal);
      nav("/all-meals");
    } catch (error) {
      handleError("Add Meal Error: ", error);
    }
  }

  //Gets all meals for the User
  async function getUserMeals() {
    try {
      const { data } = await axios.get(
        `${API_URL}/api/meals/user/${profileData._id}`
      );
      setMeals(data);
    } catch (error) {
      handleError("Error fetching meals: ", error);
    }
  }

  //Clear the Meal Form
  async function clearMeal(e) {
    e.preventDefault();

    setUseMealID("");

    setMealFormData({
      title: "",
      cuisine: "",
      description: "",
      imageUrl: [],
      allergies: [],
      plates: 1,
      pickupTime: "",
      hosted: false,
      price: 1,
    });
  }

  function clearImg(index) {
    setMealFormData((prev) => {
      const updatedImageUrls = prev.imageUrl.filter((_, i) => i !== index);
      return { ...prev, imageUrl: updatedImageUrls };
    });
  }

  function useMeal(meal) {
    setUseMealID(meal._id);

    setMealFormData({
      title: meal.title || "",
      cuisine: meal.cuisine || "",
      description: meal.description || "",
      imageUrl: meal.imageUrl || [],
      allergies: meal.allergies || [],
      plates: meal.plates || 1,
      pickupTime: meal.pickupTime || "",
      hosted: false,
      price: meal.price || 1,
    });
  }

  return (
    <div className="add-meal-container">
      {meals.length > 0 && sideBarOpen && (
        <div className="sidebar">
          <div className="sidebar-header-area">
            <h4>Previous Creations</h4>
            <div
              className="collapse-bar"
              onClick={() => setSideBarOpen((prev) => !prev)}
            ></div>
          </div>

          <section className="side-bar-prevmeal">
            {/* Render Previous meals */}
            {meals.map((meal) => (
              <PrevMealCard key={meal._id} meal={meal} useMeal={useMeal} />
            ))}
          </section>
        </div>
      )}

      {meals.length > 0 && !sideBarOpen && (
        <div
          className="expand-bar"
          onClick={() => setSideBarOpen((prev) => !prev)}
        ></div>
      )}

      <section className="meal-form-container">
        <div className="meal-form-header">
          <div>
            <h2 className="meal-form-heading">Meal Details</h2>
            <img src={SpoonIcon} alt="" className="add-spoon-img" />
          </div>
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
        </div>

        <form onSubmit={handleSubmit} className="meal-form">
          <div className="col-fields">
            <div className="col-field">
              {/*Title Field */}
              <label htmlFor="title">Title</label>
              <input
                type="text"
                name="title"
                required
                disabled={useMealID ? true : false}
                value={mealFormData.title}
                onChange={handleChange}
                placeholder="The Meal title"
                className={`meal-input ${useMealID ? "input-disabled" : ""}`}
              ></input>

              {/*Description Field */}
              <label htmlFor="description">Description</label>
              <textarea
                name="description"
                value={mealFormData.description}
                placeholder="Describe the Meal"
                onChange={handleChange}
                className="meal-input-desc"
              />
            </div>

            <div className="col-field col-field-img">
              {/*Image Field */}
              <label htmlFor="imageUrl">Meal Images</label>
              <input
                type="file"
                accept="image/*"
                name="imageUrl"
                multiple
                onChange={handleImageUpload}
                className="meal-input meal-input-img"
              ></input>

              {mealFormData.imageUrl.length === 0 && imgError && (
                <p className="errors">Please upload at least one image.</p>
              )}

              <div className="meal-images-containter">
                {mealFormData.imageUrl &&
                  mealFormData.imageUrl.map((image, index) => (
                    <div className="meal-image-containter" key={index}>
                      <img
                        src={image}
                        alt="Uploaded Meal Image"
                        className="form-meal-img"
                      />
                      <p onClick={() => clearImg(index)}>X</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <div className="col-fields">
            <div className="col-field">
              {/*Cuisine Field */}
              <label htmlFor="cuisine">Cuisine</label>
              <Dropdown
                onSelect={(selectedValue) =>
                  setMealFormData((prev) => ({
                    ...prev,
                    cuisine: selectedValue,
                  }))
                }
              >
                <Dropdown.Toggle
                  variant="warning"
                  id="cuisine-dropdown"
                  className="meal-input"
                >
                  {mealFormData.cuisine || "Select Cuisine"}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item eventKey="Italian">Italian</Dropdown.Item>
                  <Dropdown.Item eventKey="Mexican">Mexican</Dropdown.Item>
                  <Dropdown.Item eventKey="Indian">Indian</Dropdown.Item>
                  <Dropdown.Item eventKey="Chinese">Chinese</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>

            <div className="col-field">
              {/*Allergies Field */}
              <label htmlFor="allergies" className="col25">
                Allergies
              </label>

              <Select
                options={[
                  { value: "Peanuts", label: "Peanuts 🥜" },
                  { value: "Shellfish", label: "Shellfish 🦐" },
                  { value: "Dairy", label: "Dairy 🥛" },
                  { value: "Gluten", label: "Gluten 🍞" },
                ]}
                isMulti
                value={mealFormData.allergies?.map((allergy) => ({
                  value: allergy,
                  label: allergy,
                }))}
                onChange={(selectedOptions) =>
                  setMealFormData((prev) => ({
                    ...prev,
                    allergies: selectedOptions.map((option) => option.value),
                  }))
                }
                placeholder="Select Allergies"
                styles={{ padding: "0 !important" }}
              />
            </div>
          </div>

          <div className="col-fields">
            <div className="col-field">
              {/*No. of Plates Field */}
              <label htmlFor="plates" className="col25">
                Plates
              </label>
              <input
                type="number"
                name="plates"
                required
                value={mealFormData.plates}
                onChange={handleChange}
                className="meal-input"
                min={1}
              ></input>
            </div>

            <div className="col-field">
              {/*Price Field */}
              <label htmlFor="price" className="col25">
                Price
              </label>
              <input
                type="number"
                name="price"
                required
                value={mealFormData.price}
                onChange={handleChange}
                className="meal-input"
                min={1}
              ></input>
            </div>
          </div>

          <div className="col-fields">
            <div className="col-field">
              {/*Address Field */}
              <label htmlFor="pickupTime" className="col25">
                Address
              </label>

              <AddressSearch componentId="meal-form" />
            </div>

            <div className="col-field-row">
              <div className="col-field">
                {/*Pickup Time Field */}
                <label htmlFor="pickupTime">Date</label>
                <input
                  type="datetime-local"
                  name="pickupTime"
                  required
                  value={mealFormData.pickupTime}
                  onChange={handleChange}
                  className="meal-input"
                ></input>
              </div>

              <div className="col-field">
                {/*Is the Meal hosted indicator*/}
                <label htmlFor="hosted">Hosted</label>

                <input
                  type="checkbox"
                  name="hosted"
                  checked={mealFormData.hosted}
                  onChange={(e) =>
                    setMealFormData((prev) => ({
                      ...prev,
                      hosted: e.target.checked,
                    }))
                  }
                  className="meal-input meal-input-checkbox"
                ></input>
              </div>
            </div>
          </div>

          <div className="bottom-buttons">
            {/*Clear the Meal form*/}
            <button
              type="submit"
              variant="primary"
              className="meal-clear-button add-meal-button"
              onClick={clearMeal}
            >
              Clear The Meal
            </button>

            {/*Sumbit the Meal to List it on the Site*/}
            <button
              type="submit"
              variant="primary"
              className="meal-submit-button add-meal-button"
            >
              List Your Meal
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default AddMeal;
