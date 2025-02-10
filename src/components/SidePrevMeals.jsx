import { useState } from "react";
import PrevMealCard from "./PrevMealCard";

const SidePrevMeals = ({ mode, meals, useMeal }) => {
  const [sideBarOpen, setSideBarOpen] = useState(true);
  return (
    <>
      {mode !== "Edit" && meals.length > 0 && sideBarOpen && (
        <div className="sidebar">
          <div className="sidebar-header-area">
            <h4>Previous Creations</h4>
            <div
              className="collapse-bar"
              onClick={() => setSideBarOpen((prev) => !prev)}
            ></div>
          </div>

          <section className="side-bar-prevmeal">
            {/* Render Previous meals */}
            {meals.map((meal) => (
              <PrevMealCard key={meal._id} meal={meal} useMeal={useMeal} />
            ))}
          </section>
        </div>
      )}

      {meals.length > 0 && !sideBarOpen && (
        <div
          className="expand-bar"
          onClick={() => setSideBarOpen((prev) => !prev)}
        ></div>
      )}
    </>
  );
};

export default SidePrevMeals;
