import "../styles/MealList.css";

import axios from "axios";
import { API_URL } from "../config/apiConfig.js";

import { useContext, useEffect, useState } from "react";

import { useToast } from "../contexts/toast.context.jsx";
import FunctionBar from "../components/FunctionBar.jsx";
import { AuthContext } from "../contexts/auth.context.jsx";
import MealListCard from "../components/MealListCard.jsx";

const MealList = () => {
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

  return (
    <div className="meal-list">
      <button onClick={() => setToast({ msg: "test", type: "primary" })}>
        TOast
      </button>
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
        {meals.map((meal) => (
          <MealListCard key={meal._id} meal={meal} />
        ))}
      </div>
    </div>
  );
};

export default MealList;
