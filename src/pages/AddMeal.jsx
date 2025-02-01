import "../styles/AddUpdMeal.css";
import SpoonIcon from "../assets/spoon.png";

import { useState } from "react";

const AddMeal = () => {
  const [mealFormData, setMealFormData] = useState({ title: null });

  function handleChange(e) {
    setFormData((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
  }

  return (
    <div className="meal-form-container">
      <section>
        <h2 className="meal-form-heading">Meal Details</h2>
        <img src={SpoonIcon} alt="" className="add-spoon-img" />

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
            className="meal-submit-button"
          >
            Submit
          </button>
        </form>
      </section>
    </div>
  );
};

export default AddMeal;
