const PrevMealCard = ({ meal }) => {
  return (
    <div className="prevmeal-container">
      <div className="prev-meal-card">
        <img src={meal.imageUrl} alt="" />{" "}
        <button className="use-meal-button add-meal-button">
          Use this Meal
        </button>
      </div>
      <h6>{meal.title}</h6>
    </div>
  );
};
export default PrevMealCard;
