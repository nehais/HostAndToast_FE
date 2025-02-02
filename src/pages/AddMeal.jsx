import "../styles/AddUpdMeal.css";
import SpoonIcon from "../assets/spoon.png";
import ReuseIcon from "../assets/reuse.png";

import axios from "axios";
import { API_URL } from "../config/apiConfig.js";

import { useState } from "react";
import PrevMealCard from "../components/PrevMealCard.jsx";
import { uploadToCloudinary } from "../utils/cloudinaryUpload";

import Select from "react-select";
import { Dropdown } from "react-bootstrap";

const AddMeal = () => {
  const [sideBarOpen, setSideBarOpen] = useState(true);
  const [mealFormData, setMealFormData] = useState({
    title: "",
    cuisine: "",
    description: "",
    imageUrl: "",
    allergies: [],
    plates: 1,
    pickupTime: "",
    hosted: false,
    price: 1,
  });
  const [meals, setMeals] = useState([]);
  const [useMealID, setUseMealID] = useState("");

  function handleChange(e) {
    setFormData((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
  }

  async function handleFileUpload(e) {
    const file = e.target.files[0];

    try {
      // Upload the image to Cloudinary
      console.log("Uploading the Image...");
      const uploadedUrl = await uploadToCloudinary(file, "Image"); // Upload to Cloudinary

      if (uploadedUrl) {
        setMealFormData((prev) => {
          return { ...prev, imageUrl: uploadedUrl };
        });
      }
    } catch (error) {
      console.error("File upload failed:", error);
    }
  }

  async function getAllMeals() {
    try {
      const { data } = await axios.get(`${API_URL}/api/meals`);
      setMeals(data);
    } catch (error) {
      console.log("Error fetching meals", error.response.data.message);
    }
  }

  function useMeal(meal) {
    setUseMealID(meal._id);

    setMealFormData({
      title: meal.title || "",
      cuisine: meal.cuisine || "",
      description: meal.description || "",
      imageUrl: meal.imageUrl || "",
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

          <button
            className="load-prevmeal-button add-meal-button"
            onClick={() => getAllMeals()}
          >
            <img src={ReuseIcon} alt="" className="reuse-img" />
            Load Previous Meals
          </button>
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
                required
                onChange={handleFileUpload}
                className="meal-input meal-input-img"
              ></input>

              <div className="meal-images-containter">
                {mealFormData.imageUrl && (
                  <div className="meal-image-containter">
                    <img
                      src={mealFormData.imageUrl}
                      alt="Uploaded Meal Images"
                      className="form-meal-img"
                    />
                    <p>X</p>
                  </div>
                )}
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
              <label htmlFor="pickupTime" className="col25">
                Date
              </label>
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
              <label htmlFor="hosted" className="col25">
                To Be Hosted
              </label>

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

          <button
            type="submit"
            variant="primary"
            className="meal-submit-button add-meal-button"
          >
            List You Meal
          </button>
        </form>
      </section>
    </div>
  );
};

export default AddMeal;
