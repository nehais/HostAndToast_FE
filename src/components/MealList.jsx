import { useEffect } from "react";
import "../styles/MealList.css";

import MealListCard from "./MealListCard.jsx";

const MealList = ({ meals, active, orders, hideActions }) => {
  useEffect(() => {
    console.log("Orders in meal list", orders);
  }, [orders]);

  return (
    <div className="meal-list">
      {/* Meal List */}
      {meals && (
        <div className="meal-list-cards">
          {meals.map((meal) => (
            <MealListCard key={meal._id} meal={meal} active={active} />
          ))}
        </div>
      )}

      {/* Order List */}
      {orders && (
        <div className="meal-list-cards">
          {orders.map((order) => (
            <MealListCard
              key={order._id}
              meal={order.meal}
              order={order}
              active={active}
              hideActions={hideActions}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MealList;
