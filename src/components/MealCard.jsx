import "../styles/MealCard.css";

const MealCard = ({ meal }) => {
  // console.log("This is the meal:", meal);
  return (
    <div id="meal-card">
      <img src={meal.imageUrl} alt={meal.title} />
      <div id="meal-card-infos">{meal.title}</div>
    </div>
  );
};
export default MealCard;
