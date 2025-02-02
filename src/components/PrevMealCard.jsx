const PrevMealCard = ({ meal, useMeal }) => {
  return (
    <div className="prevmeal-container">
      <img src={meal.imageUrl} alt="Previous Meal Image" />
      <div className="prev-meal-card">
        <h6 id="prev-meal-title">{meal.title}</h6>
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
