import React from "react";

import { useState } from "react";
import MealList from "./MealList";

const DisplayDropDown = ({
  notification,
  mealCount,
  active,
  meals,
  orders,
  hideActions,
  setRefreshProfile,
}) => {
  const [showMeals, setShowMeals] = useState(false);

  return (
    <>
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
      {showMeals && (
        <MealList
          meals={meals}
          active={active}
          orders={orders}
          hideActions={hideActions}
          setRefreshProfile={setRefreshProfile}
          setShowMeals={setShowMeals}
        />
      )}
    </>
  );
};

export default DisplayDropDown;
