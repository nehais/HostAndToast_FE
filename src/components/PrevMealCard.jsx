import StarRating from "../components/StarRating.jsx";

const PrevMealCard = ({ meal, useMeal }) => {
  return (
    <div className="prevmeal-container">
      <img src={meal.imageUrl[0]} alt="Previous Meal Image" />
      <div className="prev-meal-card">
        <h6 id="prev-meal-title">{meal.title}</h6>

        <StarRating
          initialValue={meal.mealRating ? meal.mealRating : 0}
          editable={false}
          small={true}
        />

        <button
          className="use-meal-button add-meal-button"
          onClick={() => useMeal(meal)}
        >
          Use this Meal
        </button>
      </div>
    </div>
  );
};
export default PrevMealCard;
