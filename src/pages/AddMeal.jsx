import "../styles/AddUpdMeal.css";
import SpoonIcon from "../assets/spoon.png";
import ReuseIcon from "../assets/reuse.png";

import axios from "axios";
import { API_URL } from "../config/apiConfig.js";

import { useState } from "react";
import PrevMealCard from "../components/PrevMealCard.jsx";

const AddMeal = () => {
  const [sideBarOpen, setSideBarOpen] = useState(true);
  const [mealFormData, setMealFormData] = useState({ title: null });
  const [meals, setMeals] = useState([]);

  function handleChange(e) {
    setFormData((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
  }

  async function getAllMeals() {
    try {
      const { data } = await axios.get(`${API_URL}/api/meals`);
      setMeals(data);
    } catch (error) {
      console.log("Error fetching meals", error.response.data.message);
    }
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
              <PrevMealCard key={meal._id} meal={meal} />
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
              <label htmlFor="title">Title</label>
              <input
                type="text"
                name="title"
                required
                value={mealFormData.title}
                onChange={handleChange}
                className="meal-input"
              ></input>
            </div>

            <div className="col-field">
              <label htmlFor="cuisine">Cuisine</label>
              <input
                type="text"
                name="cuisine"
                required
                value={mealFormData.cuisine}
                onChange={handleChange}
                className="meal-input"
              ></input>
            </div>
          </div>

          <div className="col-fields">
            <div className="col-field">
              <label htmlFor="description">Description</label>
              <input
                type="text"
                name="description"
                required
                value={mealFormData.description}
                onChange={handleChange}
                className="meal-input"
              ></input>
            </div>

            <div className="col-field">
              <label htmlFor="imageUrl">Image</label>
              <input
                type="file"
                name="imageUrl"
                required
                value={mealFormData.imageUrl}
                onChange={handleChange}
                className="meal-input"
              ></input>
            </div>
          </div>

          <div className="row">
            <label htmlFor="allergies" className="col25">
              Allergies
            </label>
            <input
              type="text"
              name="allergies"
              value={mealFormData.allergies}
              onChange={handleChange}
              className="col75 meal-input"
            ></input>
          </div>

          <div className="row">
            <label htmlFor="plates" className="col25">
              Plates
            </label>
            <input
              type="number"
              name="plates"
              required
              value={mealFormData.plates}
              onChange={handleChange}
              className="col75 meal-input"
              min={1}
            ></input>
          </div>

          <div className="row">
            <label htmlFor="date" className="col25">
              Date
            </label>
            <input
              type="date"
              name="date"
              required
              value={mealFormData.date}
              onChange={handleChange}
              className="col75 meal-input"
            ></input>
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
