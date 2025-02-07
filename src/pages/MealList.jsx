import "../styles/MealList.css";

import axios from "axios";
import { API_URL } from "../config/apiConfig.js";

import { useContext, useEffect, useState } from "react";

import { useToast } from "../contexts/toast.context.jsx";
import FunctionBar from "../components/FunctionBar.jsx";
import { AuthContext } from "../contexts/auth.context.jsx";
import MealListCard from "../components/MealListCard.jsx";

const MealList = ({ setGenMessageModal }) => {
  const [ascSort, setAscSort] = useState(true);
  const [searchStr, setSearchStr] = useState("");
  const [meals, setMeals] = useState([]);
  const { profileData } = useContext(AuthContext);
  const { setToast } = useToast(); //Use setToast context to set message

  useEffect(() => {
    getUserMeals();
  }, [profileData._id]);

  //Gets all meals for the User
  async function getUserMeals() {
    try {
      const { data } = await axios.get(
        `${API_URL}/api/meals/user/${profileData._id}`
      );
      setMeals(data);
    } catch (error) {
      handleError("Error fetching meals: ", error);
    }
  }

  useEffect(() => {
    /*Sort the Meal added here*/
    if (meals.length > 0) {
      let tempMeals = sortByTitle();
      setMeals([...tempMeals]);
    }
  }, [ascSort]);

  function sortByTitle() {
    return meals.sort((a, b) => {
      const titleA = a.title || ""; // Fallback to empty string
      const titleB = b.title || ""; // Fallback to empty string

      if (ascSort) {
        return titleA.localeCompare(titleB);
      } else {
        return titleB.localeCompare(titleA);
      }
    });
  }

  return (
    <div className="meal-list">
      {/* Search & Sort */}
      <div className="function-area">
        <FunctionBar
          searchStr={searchStr}
          setSearchStr={setSearchStr}
          ascSort={ascSort}
          setAscSort={setAscSort}
        />
      </div>

      {/* Meal List */}
      <div className="meal-list-cards">
        {meals
          .filter((meal) => {
            return (
              meal.title.toUpperCase().search(searchStr.toUpperCase()) >= 0
            );
          })
          .map((meal) => (
            <MealListCard
              key={meal._id}
              meal={meal}
              setGenMessageModal={setGenMessageModal}
            />
          ))}
      </div>
    </div>
  );
};

export default MealList;
