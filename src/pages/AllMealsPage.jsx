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
    price: 20, // initial price (will adjust once meals load)
    cuisine: [], // selected cuisines; on initial load, all cuisines are selected
    pickupDate: null, // selected pickup date; null means no date filter
  });
  const [initialCuisineSet, setInitialCuisineSet] = useState(false);

  // Helper: Compare two dates ignoring time.
  const isSameDay = (d1, d2) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  // --- Fetch Meals ---
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

  // --- Global Values ---
  // All cuisines from the raw meals data.
  const allCuisines = useMemo(() => {
    return [...new Set(meals.map((meal) => meal.cuisine))];
  }, [meals]);

  // Maximum price from all meals.
  const allMaxPrice = useMemo(() => {
    return meals.reduce((max, meal) => Math.max(max, meal.price), 0);
  }, [meals]);

  // --- Derived Values for Cuisine Counts (Price & Pickup Date) ---
  // For showing counts (and for auto-unchecking), filter meals by price and, if set, by pickup date.
  const availableMealsForCuisine = useMemo(() => {
    return meals.filter((meal) => {
      if (meal.price > filters.price) return false;
      if (filters.pickupDate && !isSameDay(new Date(meal.pickupTime), filters.pickupDate))
        return false;
      return true;
    });
  }, [meals, filters.price, filters.pickupDate]);

  // Compute counts for each cuisine.
  const cuisineCounts = useMemo(() => {
    const counts = {};
    availableMealsForCuisine.forEach((meal) => {
      counts[meal.cuisine] = (counts[meal.cuisine] || 0) + 1;
    });
    return counts;
  }, [availableMealsForCuisine]);

  // --- Derived Values for Pickup Date Highlights ---
  // For the DatePicker, we compute all available pickup dates based on price and selected cuisines.
  // Note that we do not restrict the available dates when a pickup date is chosen.
  const availableMealsForPickupDates = useMemo(() => {
    return meals.filter((meal) => {
      if (meal.price > filters.price) return false;
      if (filters.cuisine.length === 0 || !filters.cuisine.includes(meal.cuisine)) return false;
      return true;
    });
  }, [meals, filters.price, filters.cuisine]);

  const availablePickupDates = useMemo(() => {
    const datesSet = new Set();
    availableMealsForPickupDates.forEach((meal) => {
      const d = new Date(meal.pickupTime);
      // Use a key based on year-month-day.
      const key = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
      datesSet.add(key);
    });
    return Array.from(datesSet).map((key) => {
      const [year, month, day] = key.split("-").map(Number);
      return new Date(year, month - 1, day);
    });
  }, [availableMealsForPickupDates]);

  // --- Initialize the Cuisine Filter ---
  // On first load, select all cuisines.
  useEffect(() => {
    if (meals.length > 0 && !initialCuisineSet) {
      setFilters((prev) => ({ ...prev, cuisine: allCuisines }));
      setInitialCuisineSet(true);
    }
  }, [meals, allCuisines, initialCuisineSet]);

  // --- Auto-Uncheck Cuisines Not Available ---
  // If a cuisine’s available count becomes 0, remove it from the filter state.
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      cuisine: prev.cuisine.filter((cuisine) => (cuisineCounts[cuisine] || 0) > 0),
    }));
  }, [cuisineCounts]);

  // --- Update Filtered Meals ---
  // Apply all filters: price, selected cuisines, and (if set) the pickup date.
  useEffect(() => {
    const filtered = meals.filter((meal) => {
      if (meal.price > filters.price) return false;
      if (filters.cuisine.length === 0 || !filters.cuisine.includes(meal.cuisine)) return false;
      if (filters.pickupDate && !isSameDay(new Date(meal.pickupTime), filters.pickupDate))
        return false;
      return true;
    });
    setFilteredMeals(filtered);
  }, [filters, meals]);

  // --- Update Map Markers ---
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

  // --- "Show All"/"Uncheck All" Button ---
  // Here we base the toggle on all cuisines from the raw data.
  const areAllChecked = useMemo(() => {
    return (
      allCuisines.length > 0 && allCuisines.every((cuisine) => filters.cuisine.includes(cuisine))
    );
  }, [allCuisines, filters.cuisine]);

  const handleCheckAllCuisines = () => {
    if (areAllChecked) {
      setFilters((prev) => ({ ...prev, cuisine: [] }));
    } else {
      // When setting all, note that the auto-uncheck effect will remove any with 0 count.
      setFilters((prev) => ({ ...prev, cuisine: allCuisines }));
    }
  };

  // --- Reset Filters ---
  const resetFilters = () => {
    setFilters({
      price: allMaxPrice,
      cuisine: allCuisines,
      pickupDate: null,
    });
  };

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
                <legend>Maximal Price</legend>
                <input
                  type="range"
                  name="price"
                  min="0"
                  max={allMaxPrice}
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
                  {/* Render all cuisines even if not available */}
                  {allCuisines.map((cuisine, index) => (
                    <div key={index}>
                      <input
                        type="checkbox"
                        name="cuisine"
                        value={cuisine}
                        checked={filters.cuisine.includes(cuisine)}
                        onChange={() => {
                          let newCuisines = [...filters.cuisine];
                          if (newCuisines.includes(cuisine)) {
                            newCuisines = newCuisines.filter((c) => c !== cuisine);
                          } else {
                            newCuisines.push(cuisine);
                          }
                          setFilters((prev) => ({ ...prev, cuisine: newCuisines }));
                        }}
                      />
                      <label>
                        {cuisine} ({cuisineCounts[cuisine] || 0})
                      </label>
                    </div>
                  ))}
                </fieldset>
                <button type="button" onClick={handleCheckAllCuisines}>
                  {areAllChecked ? "Uncheck All" : "Show All"}
                </button>
              </div>

              {/* Pickup Date Filter */}
              <div style={{ marginTop: "10px" }}>
                <label>
                  <legend>Pickup Date</legend>
                  <DatePicker
                    selected={filters.pickupDate}
                    onChange={(date) => setFilters((prev) => ({ ...prev, pickupDate: date }))}
                    placeholderText="Select a pickup date"
                    // Always highlight all available pickup dates based on price and cuisine.
                    highlightDates={availablePickupDates}
                    isClearable
                  />
                </label>
              </div>

              {/* Reset Filters Button */}
              <div style={{ marginTop: "10px" }}>
                <button type="button" onClick={resetFilters}>
                  Reset Filters
                </button>
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
