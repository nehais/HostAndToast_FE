import { useState } from "react";
import "../styles/AddUpdMeal.css";

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
      <section className="meal-form">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <label htmlFor="title" className="col25">
              Title:
            </label>
            <input
              type="text"
              name="title"
              required
              value={mealFormData.title}
              onChange={handleChange}
              className="col75"
            ></input>
          </div>

          <button type="submit" variant="primary">
            Submit
          </button>
        </form>
      </section>
    </div>
  );
};

export default AddMeal;
