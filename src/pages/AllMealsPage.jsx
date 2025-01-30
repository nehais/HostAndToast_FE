import React, { useEffect, useState } from "react";
import MealCard from "../components/MealCard";
import "../styles/AllMealsPage.css";
import axios from "axios";
import { API_URL } from "../config/apiConfig.js";
import Map from "../components/Map.jsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AllMealsPage = () => {
  const [meals, setMeals] = useState([]);
  const [filteredMeals, setFilteredMeals] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [maxPrice, setMaxPrice] = useState(20);
  const [cuisines, setCuisines] = useState([]);
  const [filters, setFilters] = useState({
    price: maxPrice, // Initially set to max price
    cuisine: [], // Initially empty, will be updated with selected cuisines
    pickupDay: "", // Ensure this is a string in "yyyy-MM-dd" format
  });
  const [pickupDays, setPickupDays] = useState([]); // Store unique pickup days from meals
  const [selectAll, setSelectAll] = useState(true); // Track if all cuisines are selected

  useEffect(() => {
    async function getMeals() {
      try {
        const { data } = await axios.get(`${API_URL}/api/meals`);
        setMeals(data);
      } catch (error) {
        console.log("Error fetching meals", error.response.data.message);
      }
    }
    getMeals();
  }, []); // Fetch meals only once on initial load

  useEffect(() => {
    const maxPriceFound = meals.reduce((max, meal) => {
      return meal.price > max ? meal.price : max;
    }, 0);
    setMaxPrice(maxPriceFound);

    const cuisinesFound = meals.reduce((cuisines, meal) => {
      if (!cuisines.includes(meal.cuisine)) {
        cuisines.push(meal.cuisine);
      }
      return cuisines;
    }, []);
    setCuisines(cuisinesFound);

    // Set all cuisines as initially selected
    setFilters((prevFilters) => ({
      ...prevFilters,
      cuisine: cuisinesFound, // Select all cuisines by default
    }));
  }, [meals]);

  useEffect(() => {
    const filtered = meals.filter((meal) => {
      // Filter by price
      if (filters.price && meal.price > filters.price) {
        return false;
      }
      // Filter by cuisine
      if (filters.cuisine.length && !filters.cuisine.includes(meal.cuisine)) {
        return false;
      }
      // Filter by pickup day
      if (filters.pickupDay && meal.pickupTime.split("T")[0] !== filters.pickupDay) {
        return false;
      }
      return true;
    });
    setFilteredMeals(filtered); // Update the filtered meals state
  }, [filters, meals]); // This effect runs when filters or meals change

  useEffect(() => {
    const uniquePickupDays = [...new Set(meals.map((meal) => meal.pickupTime.split("T")[0]))];
    setPickupDays(uniquePickupDays); // Get unique pickup days (only date part of pickupTime)
  }, [meals]);

  useEffect(() => {
    // Update markers based on filtered meals
    const allMarkers = filteredMeals.map((meal) => ({
      geocode: [meal.user.address.lat, meal.user.address.long],
      popUp: (
        <>
          <p className="pop-up">
            🍽️ <strong> Meal:</strong> {meal.title}
          </p>
          <p className="pop-up">
            🧑‍🍳 <strong> Cook:</strong> {meal.user.username}
          </p>
        </>
      ),
    }));
    setMarkers(allMarkers); // Set the markers for the filtered meals
  }, [filteredMeals]); // Update markers whenever filteredMeals changes

  const handleDateChange = (date) => {
    const formattedDate = date ? date.toISOString().split("T")[0] : "";
    setFilters({ ...filters, pickupDay: formattedDate });
  };

  // Handle the check/uncheck all button
  const handleCheckAllCuisines = () => {
    if (selectAll) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        cuisine: [], // Uncheck all cuisines
      }));
    } else {
      setFilters((prevFilters) => ({
        ...prevFilters,
        cuisine: cuisines, // Check all cuisines
      }));
    }
    setSelectAll(!selectAll); // Toggle the selectAll state
  };

  // Custom date function to highlight the available pickup days
  const highlightDates = pickupDays.map((date) => new Date(date));

  return (
    <>
      <div>
        <h1>All Meals Page</h1>
      </div>
      <div id="all-meals-page">
        <div id="left-column">
          <div id="filter">
            Filters
            <form>
              {/* Max Price */}
              <label>
                Max Price:
                <input
                  type="range"
                  name="price"
                  min="0"
                  max={maxPrice}
                  step="1"
                  value={filters.price}
                  onChange={(e) => setFilters({ ...filters, price: e.target.value })}
                />
                <span>{filters.price || maxPrice} €</span>
              </label>

              {/* Check/Uncheck All Button for Cuisines */}
              <button
                type="button"
                onClick={handleCheckAllCuisines}
                style={{ marginBottom: "10px" }}
              >
                {selectAll ? "Uncheck All" : "Check All"}
              </button>

              {/* Cuisines */}
              <label>
                Cuisine:
                {cuisines.map((cuisine, index) => (
                  <div key={index}>
                    <input
                      type="checkbox"
                      name="cuisine"
                      value={cuisine}
                      checked={filters.cuisine.includes(cuisine)}
                      onChange={() => {
                        const newCuisines = [...filters.cuisine];
                        if (newCuisines.includes(cuisine)) {
                          newCuisines.splice(newCuisines.indexOf(cuisine), 1);
                        } else {
                          newCuisines.push(cuisine);
                        }
                        setFilters((prevFilters) => ({
                          ...prevFilters,
                          cuisine: newCuisines,
                        }));
                      }}
                    />
                    <label>{cuisine}</label>
                  </div>
                ))}
              </label>

              {/* Pickup Day */}
              <label>
                Pickup Day:
                <DatePicker
                  selected={filters.pickupDay ? new Date(filters.pickupDay) : null} // Ensure it's a valid Date object
                  onChange={handleDateChange}
                  dateFormat="yyyy-MM-dd"
                  highlightDates={highlightDates} // Highlight pickup days
                  inline
                />
              </label>
            </form>
          </div>
        </div>

        <div id="right-column">
          <div id="map">
            <Map markers={markers} />
          </div>
          <div id="all-cards">
            {/* Render filtered meals */}
            {filteredMeals.map((meal) => (
              <MealCard key={meal._id} meal={meal} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AllMealsPage;
