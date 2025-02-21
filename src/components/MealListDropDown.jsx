import React from "react";

import { useState } from "react";
import MealList from "./MealList";

const MealListDropDown = ({
  notification,
  mealCount,
  active,
  meals,
  orders,
  hideActions,
}) => {
  const [showMeals, setShowMeals] = useState(false);

  return (
    <>
      {/*Drop Down Header */}
      <div className="display-block-dd">
        <p className={active ? "notification-active" : "notification-inactive"}>
          You have <em>{mealCount}</em> {notification}
        </p>
        {!showMeals && (
          <div
            className="expand-bar prof-collapse"
            onClick={() => setShowMeals((prev) => !prev)}
          ></div>
        )}
        {showMeals && (
          <div
            className="collapse-bar prof-collapse"
            onClick={() => setShowMeals((prev) => !prev)}
          ></div>
        )}
      </div>

      {/*Meal List */}
      {showMeals && mealCount > 0 && (
        <MealList
          meals={meals}
          active={active}
          orders={orders}
          hideActions={hideActions}
          setShowMeals={setShowMeals}
        />
      )}

      {showMeals && mealCount <= 0 && <h6>No {notification}</h6>}
    </>
  );
};

export default MealListDropDown;
