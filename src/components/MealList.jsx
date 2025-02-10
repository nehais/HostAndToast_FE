import "../styles/MealList.css";

import { useEffect, useState } from "react";

import FunctionBar from "./FunctionBar.jsx";
import MealListCard from "./MealListCard.jsx";

const MealList = ({ meals, active }) => {
  const [ascSort, setAscSort] = useState(true);
  const [searchStr, setSearchStr] = useState("");

  useEffect(() => {
    /*Sort the Meal added here*/
    if (meals.length > 0) {
      //let tempMeals = sortByTitle();
      // setMeals([...tempMeals]);
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
      {/* Search & Sort 
      <div className="function-area">
        <FunctionBar
          searchStr={searchStr}
          setSearchStr={setSearchStr}
          ascSort={ascSort}
          setAscSort={setAscSort}
        />
      </div>*/}

      {/* Meal List */}
      <div className="meal-list-cards">
        {meals
          .filter((meal) => {
            return (
              meal.title.toUpperCase().search(searchStr.toUpperCase()) >= 0
            );
          })
          .map((meal) => (
            <MealListCard key={meal._id} meal={meal} active={active} />
          ))}
      </div>
    </div>
  );
};

export default MealList;
