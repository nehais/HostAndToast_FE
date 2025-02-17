import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Default calendar styles
import { API_URL } from "../config/apiConfig.js";
import "../styles/ChefOverviewPage.css";
import MealCard from "../components/MealCard";
import profileIcon from "../assets/profile.png";
import StarRating from "../components/StarRating.jsx";
import { AuthContext } from "../contexts/auth.context.jsx";

const ChefOverviewPage = () => {
  const { chefId } = useParams();
  const [chef, setChef] = useState(null);
  const [meals, setMeals] = useState([]);
  // New state to hold the selected date for filtering meals
  const [selectedDate, setSelectedDate] = useState(null);
  const [userRating, setUserRating] = useState(null);
  const [numberOfRatings, setNumberOfRatings] = useState(0);
  const { user } = useContext(AuthContext);
  const nav = useNavigate();

  // Fetch the chef data
  useEffect(() => {
    const getChef = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/auth/users/${chefId}`);
        setChef(data);
        // console.log("Chef", data);
      } catch (error) {
        console.log("Error fetching chef", error.response?.data?.message || error.message);
      }
    };

    getChef();
  }, [chefId]);

  // Fetch the chef's meals (using the chef's _id)
  useEffect(() => {
    const getMeals = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/meals/user/${chef?._id}`);
        setMeals(data);
        console.log("Meals", data);
      } catch (error) {
        console.log("Error fetching meals", error.response?.data?.message || error.message);
      }
    };

    if (chef) {
      getMeals();
    }
  }, [chef]);

  // Fetch the hosts rating
  useEffect(() => {
    if (!chef || !chef._id) return;

    const getUserRating = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/auth/users/rating/${chef._id}`);
        setUserRating(data.averageRating);
        setNumberOfRatings(data.numberOfRatings);
        // console.log("User rating", data);
      } catch (error) {
        console.log("Error fetching user rating", error.response?.data?.message || error.message);
      }
    };

    getUserRating();
  }, [chef]);

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

  function handleGetInContact() {
    const createMessage = async () => {
      try {
        const { data } = await axios.post(`${API_URL}/api/messages/empty`, {
          receiverId: chef._id,
          senderId: user._id,
        });
        // console.log("Message created", data);
        nav(`/messages?recieverId=${chef._id}`);
      } catch (error) {
        console.log("Error creating message", error.response.data.message);
      }
    };
    createMessage();
  }

  // Filter the meals based on the selected date.
  // If no date is selected, show all meals.
  const filteredMeals = selectedDate
    ? meals.filter(
        (meal) => new Date(meal.pickupTime).toDateString() === selectedDate.toDateString()
      )
    : meals;

  return (
    <div className="chef-overview">
      {chef && (
        <div className="container header">
          <div>
            <img
              src={chef.imageUrl ? chef.imageUrl : profileIcon}
              className={!chef.imageUrl ? "profile-image default-image" : "profile-image"}
            />
          </div>
          {chef && (
            <div className="user-info">
              <h1>{chef.username && chef.username}</h1>
              <p className="created-info">User since {formatDateTime(chef.createdAt)}</p>
              {chef.description && <h4>{chef.description}</h4>}
              <div className="rating">
                <StarRating initialValue={userRating ? userRating : 0} editable={false} />
                <p>Rating based on {numberOfRatings} reviews</p>
              </div>
              {user._id !== chef._id && (
                <button className="contact-btn" onClick={handleGetInContact}>
                  Get in contact
                </button>
              )}
            </div>
          )}
        </div>
      )}
      <div className="container ">
        {chef && (
          <>
            <h2 className="underline">Meals offered by {chef.username}</h2>
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

export default ChefOverviewPage;
