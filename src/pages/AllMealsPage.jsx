import { useEffect, useMemo, useState } from "react";
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
  const [filters, setFilters] = useState({
    price: 20, // initial price value (will be adjusted once meals load)
    cuisine: [], // selected cuisines; on initial load, all available cuisines will be set
    pickupDay: "", // in "yyyy-MM-dd" format
  });
  const [selectAll, setSelectAll] = useState(true);
  // This flag ensures we set the cuisine filter only once on initial load.
  const [initialCuisineSet, setInitialCuisineSet] = useState(false);

  // Fetch meals from the API
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
  }, []);

  // --- Derive available filter options based on meals and current filters ---

  // 1. For the price slider: compute the maximum price from meals that pass the other filters (excluding price)
  const availableMealsForPrice = useMemo(() => {
    return meals.filter((meal) => {
      // Apply cuisine and pickup day filters (but not price)
      if (filters.cuisine.length && !filters.cuisine.includes(meal.cuisine)) return false;
      if (filters.pickupDay && meal.pickupTime.split("T")[0] !== filters.pickupDay) return false;
      return true;
    });
  }, [meals, filters.cuisine, filters.pickupDay]);

  const computedMaxPrice = useMemo(() => {
    return availableMealsForPrice.reduce((max, meal) => Math.max(max, meal.price), 0);
  }, [availableMealsForPrice]);

  // 2. For the cuisine filter: compute available cuisines from meals filtered by price and pickupDay
  const availableMealsForCuisine = useMemo(() => {
    return meals.filter((meal) => {
      if (filters.price && meal.price > filters.price) return false;
      if (filters.pickupDay && meal.pickupTime.split("T")[0] !== filters.pickupDay) return false;
      return true;
    });
  }, [meals, filters.price, filters.pickupDay]);

  const availableCuisines = useMemo(() => {
    return [...new Set(availableMealsForCuisine.map((meal) => meal.cuisine))];
  }, [availableMealsForCuisine]);

  // 3. For the pickup day filter: compute available pickup days from meals filtered by price and cuisine
  const availableMealsForPickupDay = useMemo(() => {
    return meals.filter((meal) => {
      if (filters.price && meal.price > filters.price) return false;
      // If no cuisine is selected or the meal's cuisine is not among the selected ones, exclude it.
      if (filters.cuisine.length === 0 || !filters.cuisine.includes(meal.cuisine)) return false;
      return true;
    });
  }, [meals, filters.price, filters.cuisine]);

  const availablePickupDays = useMemo(() => {
    return [...new Set(availableMealsForPickupDay.map((meal) => meal.pickupTime.split("T")[0]))];
  }, [availableMealsForPickupDay]);

  // --- Set the initial cuisine filter once meals have loaded ---
  useEffect(() => {
    if (meals.length > 0 && !initialCuisineSet) {
      // On initial load, select all available cuisines (based on the current price and pickupDay filters)
      setFilters((prev) => ({ ...prev, cuisine: availableCuisines }));
      setInitialCuisineSet(true);
    }
  }, [meals, availableCuisines, initialCuisineSet]);

  // --- Synchronize the cuisine filter when available cuisines change ---
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      cuisine: prev.cuisine.filter((cuisine) => availableCuisines.includes(cuisine)),
    }));
  }, [availableCuisines]);

  // --- Update the filtered meals based on current filters ---
  useEffect(() => {
    const filtered = meals.filter((meal) => {
      // Price filter
      if (filters.price && meal.price > filters.price) {
        return false;
      }
      // Cuisine filter: if no cuisine is selected, filter out all meals.
      if (filters.cuisine.length === 0 || !filters.cuisine.includes(meal.cuisine)) {
        return false;
      }
      // Pickup day filter
      if (filters.pickupDay && meal.pickupTime.split("T")[0] !== filters.pickupDay) {
        return false;
      }
      return true;
    });
    setFilteredMeals(filtered);
  }, [filters, meals]);

  // --- Update the markers for the map based on the filtered meals ---
  useEffect(() => {
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
    setMarkers(allMarkers);
  }, [filteredMeals]);

  // --- Handle Date changes ---
  const handleDateChange = (date) => {
    const formattedDate = date ? date.toISOString().split("T")[0] : "";
    setFilters((prev) => ({ ...prev, pickupDay: formattedDate }));
  };

  // --- Handle Check/Uncheck All for cuisines ---
  const handleCheckAllCuisines = () => {
    if (selectAll) {
      // "Uncheck All" → clear the cuisine filter (so no meal is shown)
      setFilters((prev) => ({ ...prev, cuisine: [] }));
    } else {
      // "Check All" → set the cuisine filter to the currently available cuisines
      setFilters((prev) => ({ ...prev, cuisine: availableCuisines }));
    }
    setSelectAll(!selectAll);
  };

  // --- When the computed maximum price changes, adjust the price filter if needed ---
  useEffect(() => {
    if (filters.price > computedMaxPrice) {
      setFilters((prev) => ({ ...prev, price: computedMaxPrice }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [computedMaxPrice]);

  // --- Prepare highlighted dates for the DatePicker (only highlight available pickup days) ---
  const highlightDates = useMemo(() => {
    const dates = availablePickupDays.map((dateStr) => new Date(dateStr));
    // Ensure that the selected date is always included.
    if (filters.pickupDay) {
      const selectedDate = new Date(filters.pickupDay);
      const found = dates.some(
        (d) =>
          d.getFullYear() === selectedDate.getFullYear() &&
          d.getMonth() === selectedDate.getMonth() &&
          d.getDate() === selectedDate.getDate()
      );
      if (!found) {
        dates.push(selectedDate);
      }
    }
    // Sort the dates in chronological order.
    dates.sort((a, b) => a - b);
    return dates;
  }, [availablePickupDays, filters.pickupDay]);

  return (
    <>
      <div>
        <h1>All Meals Page</h1>
      </div>
      <div id="all-meals-page">
        <div id="left-column">
          <div id="filter">
            <h3>Filters</h3>
            <form>
              {/* Price Filter */}
              <label>
                <legend>Maximal price</legend>
                <input
                  type="range"
                  name="price"
                  min="0"
                  max={computedMaxPrice}
                  step="1"
                  value={filters.price}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      price: Number(e.target.value),
                    }))
                  }
                />
                <span>{filters.price} €</span>
              </label>

              {/* Cuisine Filter */}
              <div style={{ marginTop: "10px" }}>
                <fieldset style={{ border: "none", padding: 0 }}>
                  <legend>Cuisine</legend>
                  {availableCuisines.map((cuisine, index) => (
                    <div key={index}>
                      <input
                        type="checkbox"
                        name="cuisine"
                        value={cuisine}
                        checked={filters.cuisine.includes(cuisine)}
                        onChange={() => {
                          const newCuisines = [...filters.cuisine];
                          if (newCuisines.includes(cuisine)) {
                            const idx = newCuisines.indexOf(cuisine);
                            newCuisines.splice(idx, 1);
                          } else {
                            newCuisines.push(cuisine);
                          }
                          setFilters((prev) => ({
                            ...prev,
                            cuisine: newCuisines,
                          }));
                        }}
                      />
                      <label>{cuisine}</label>
                    </div>
                  ))}
                </fieldset>
                <button type="button" onClick={handleCheckAllCuisines}>
                  {selectAll ? "Uncheck All" : "Check All"}
                </button>
              </div>

              {/* Pickup Day Filter */}
              <div style={{ marginTop: "10px" }}>
                <label>
                  <legend>Pickup date</legend>
                  <DatePicker
                    selected={filters.pickupDay ? new Date(filters.pickupDay) : null}
                    onChange={handleDateChange}
                    dateFormat="yyyy-MM-dd"
                    highlightDates={highlightDates}
                    inline
                  />
                </label>
              </div>
            </form>
          </div>
        </div>

        <div id="right-column">
          <div id="map">
            <Map markers={markers} />
          </div>
          <div id="all-cards">
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
