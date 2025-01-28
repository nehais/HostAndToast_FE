import { useEffect, useState } from "react";
import MealCard from "../components/MealCard";
import "../styles/AllMealsPage.css";
import axios from "axios";
import { API_URL } from "../config/apiConfig.js";
import Map from "../components/Map.jsx";

const AllMealsPage = () => {
  const [meals, setMeals] = useState([]);
  const [filters, setFilters] = useState({
    // add filters here
  });

  useEffect(() => {
    // fetch meals from API
    async function getMeals() {
      try {
        const { data } = await axios.get(`${API_URL}/api/meals`);
        // console.log("All meals", data);
        setMeals(data);
      } catch (error) {
        console.log("Error fetching meals", error.response.data.message);
      }
    }
    getMeals();
  }, []);

  return (
    <>
      <div>
        <h1>All Meals Page</h1>
      </div>
      <div id="all-meals-page">
        <div id="left-column">
          <div id="filter">Filters</div>
        </div>
        <div id="right-column">
          <div id="map">
            {/* include leaflet map here */}
            <Map />
          </div>
          <div id="all-cards">
            {/* render cards here with applied filters */}
            {meals &&
              meals.map((meal) => {
                return <MealCard key={meal._id} meal={meal} />;
              })}
          </div>
        </div>
      </div>
    </>
  );
};
export default AllMealsPage;
