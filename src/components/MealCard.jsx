import "../styles/MealCard.css";

const MealCard = ({ meal }) => {
  console.log("This is the meal:", meal);
  return <div id="meal-card">{meal.title}</div>;
};
export default MealCard;
