import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Default calendar styles
import { API_URL } from "../config/apiConfig.js";
import "../styles/CookOverviewPage.css";
import MealCard from "../components/MealCard";
import profileIcon from "../assets/profile.png";
import StarRating from "../components/StarRating.jsx";

const CookOverviewPage = () => {
  const { cookId } = useParams();
  const [cook, setCook] = useState(null);
  const [meals, setMeals] = useState([]);
  // New state to hold the selected date for filtering meals
  const [selectedDate, setSelectedDate] = useState(null);
  const [userRating, setUserRating] = useState(null);
  const [numberOfRatings, setNumberOfRatings] = useState(0);

  // Fetch the cook data
  useEffect(() => {
    const getCook = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/auth/users/${cookId}`);
        setCook(data);
        // console.log("Cook", data);
      } catch (error) {
        console.log("Error fetching cook", error.response?.data?.message || error.message);
      }
    };

    getCook();
  }, [cookId]);

  // Fetch the cook's meals (using the cook's _id)
  useEffect(() => {
    const getMeals = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/meals/user/${cook?._id}`);
        setMeals(data);
        console.log("Meals", data);
      } catch (error) {
        console.log("Error fetching meals", error.response?.data?.message || error.message);
      }
    };

    if (cook) {
      getMeals();
    }
  }, [cook]);

  // Fetch the hosts rating
  useEffect(() => {
    if (!cook || !cook._id) return;

    const getUserRating = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/auth/users/rating/${cook._id}`);
        setUserRating(data.averageRating);
        setNumberOfRatings(data.numberOfRatings);
        // console.log("User rating", data);
      } catch (error) {
        console.log("Error fetching user rating", error.response?.data?.message || error.message);
      }
    };

    getUserRating();
  }, [cook]);

  // Format the date and time
  const formatDateTime = (isoString) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);

    // Short or full weekday name

    // Format the date as "Wed, 20.02.25" or "Wednesday, 20.02.25"
    const formattedDate = `${date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    })}`;

    return `${formattedDate}`;
  };

  // Create a Set of date strings for quick lookup of days that have a meal.
  // We use pickupTime from your meal schema.
  const mealDatesSet = new Set(
    meals.map((meal) => {
      const mealDate = new Date(meal.pickupTime);
      return mealDate.toDateString();
    })
  );

  // Filter the meals based on the selected date.
  // If no date is selected, show all meals.
  const filteredMeals = selectedDate
    ? meals.filter(
        (meal) => new Date(meal.pickupTime).toDateString() === selectedDate.toDateString()
      )
    : meals;

  return (
    <div className="cook-overview">
      {cook && (
        <div className="container header">
          <div>
            <img
              src={cook.imageUrl ? cook.imageUrl : profileIcon}
              className={!cook.imageUrl ? "profile-image default-image" : "profile-image"}
            />
          </div>
          {cook && (
            <div className="user-info">
              <h1>{cook.username && cook.username}</h1>
              <p className="created-info">User since {formatDateTime(cook.createdAt)}</p>
              <h4>{cook.description}</h4>
              <div className="rating">
                <StarRating initialValue={userRating ? userRating : 0} editable={false} />
                <p>Rating based on {numberOfRatings} reviews</p>
              </div>
            </div>
          )}
        </div>
      )}
      <div className="container ">
        {cook && (
          <>
            <h2 className="underline">Meals offered by {cook.username}</h2>
            <div className="columns-container">
              <div className="left-column">
                {/* Calendar with highlighted meal days */}
                <div id="calendar">
                  <Calendar
                    // Highlight days that have meals
                    tileClassName={({ date, view }) => {
                      if (view === "month" && mealDatesSet.has(date.toDateString())) {
                        return "meal-day"; // CSS class for highlighted days
                      }
                    }}
                    // Update the selected date on day click
                    onClickDay={(value) => {
                      setSelectedDate(value);
                    }}
                  />
                  {selectedDate && (
                    <div className="filter-info">
                      <button onClick={() => setSelectedDate(null)}>Clear Filter</button>
                    </div>
                  )}
                </div>
              </div>
              <div className="right-column">
                <div id="all-cards">
                  {filteredMeals.map((meal) => (
                    <MealCard key={meal._id} meal={meal} />
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CookOverviewPage;
