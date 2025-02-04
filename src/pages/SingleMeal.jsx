import axios from "axios";
import { useParams } from "react-router-dom";
import { API_URL } from "../config/apiConfig.js";
import { useEffect, useState } from "react";
import "../styles/SingleMeal.css";

const SingleMeal = () => {
  const { mealId } = useParams();
  const [meal, setMeal] = useState(null);

  // Fetch the meal data
  useEffect(() => {
    const getMeal = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/meals/${mealId}`);
        setMeal(data);
        console.log("Meal", data);
      } catch (error) {
        console.log("Error fetching meal", error.response.data.message);
      }
    };
    getMeal();
  }, [mealId]);

  if (!meal) return <div>Loading...</div>;

  return (
    <div className="single-meal">
      <h1>{meal.title}</h1>
      <div className="images-container">
        <div className="main-image">
          <img src={meal.imageUrl[0]} alt={meal.title} />
        </div>
        <div className="small-images"></div>
      </div>
    </div>
  );
};
export default SingleMeal;
