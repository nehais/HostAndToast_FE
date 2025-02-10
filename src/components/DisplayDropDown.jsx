import React from "react";

import { useState } from "react";
import MealList from "./MealList";

const DisplayDropDown = ({ notification, mealCount, active, meals }) => {
  const [showActiveMeals, setShowActiveMeals] = useState(false);

  return (
    <>
      <div className="display-block-dd">
        <p className={active ? "notification-active" : "notification-inactive"}>
          You have <em>{mealCount}</em> {notification}
        </p>
        {!showActiveMeals && (
          <div
            className="expand-bar prof-collapse"
            onClick={() => setShowActiveMeals((prev) => !prev)}
          ></div>
        )}
        {showActiveMeals && (
          <div
            className="collapse-bar prof-collapse"
            onClick={() => setShowActiveMeals((prev) => !prev)}
          ></div>
        )}
      </div>
      {showActiveMeals && <MealList meals={meals} active={active} />}
    </>
  );
};

export default DisplayDropDown;
