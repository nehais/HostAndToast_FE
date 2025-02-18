// AllMealsPage.jsx
import { useEffect, useMemo, useState } from "react";
import MealCard from "../components/MealCard";
import "../styles/AllMealsPage.css";
import axios from "axios";
import { API_URL } from "../config/apiConfig.js";
import Map from "../components/Map.jsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import { AddressContext } from "../contexts/address.context.jsx";
// import { LatLngBounds } from "leaflet"; // for bounds checking

const AllMealsPage = () => {
  const [meals, setMeals] = useState([]);
  const [filteredMeals, setFilteredMeals] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [filters, setFilters] = useState({
    price: 20, // initial price (will adjust once meals load)
    cuisine: [], // selected cuisines; on initial load, all cuisines are selected
    pickupDate: null, // selected pickup date; null means no date filter
    preferences: [],
  });
  const [initialCuisineSet, setInitialCuisineSet] = useState(false);
  // New state for the current map bounds.
  const [mapBounds, setMapBounds] = useState(null);
  const [showFilters, setShowFilters] = useState(true);

  // const { address } = useContext(AddressContext);

  const allPreferences = [
    { value: "Vegan", label: "Vegan 🌿" },
    { value: "Vegetarian", label: "Vegetarian 🥕" },
    { value: "No Peanuts", label: "No Peanuts 🥜" },
    { value: "No Shellfish", label: "No Shellfish 🦐" },
    { value: "No Dairy", label: "No Dairy 🥛" },
    { value: "No Gluten", label: "No Gluten 🍞" },
  ];

  // Helper: Compare two dates ignoring time.
  const isSameDay = (d1, d2) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  useEffect(() => {
    function checkDeviceWidth() {
      if (window.innerWidth < 820) {
        setShowFilters(false);
      }
    }
    checkDeviceWidth();
  }, []);

  // --- Fetch Meals ---
  useEffect(() => {
    async function getMeals() {
      try {
        const { data } = await axios.get(`${API_URL}/api/meals/active`);
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
  const availableMealsForCuisine = useMemo(() => {
    return meals.filter((meal) => {
      // Price and pickup date filters remain.
      if (meal.price > filters.price) return false;
      if (filters.pickupDate && !isSameDay(new Date(meal.pickupTime), filters.pickupDate))
        return false;
      // NEW: Only include meals within the current map bounds if they exist.
      if (mapBounds) {
        const lat = meal.user.address.lat;
        const lng = meal.user.address.long;
        if (!mapBounds.contains([lat, lng])) return false;
      }
      return true;
    });
  }, [meals, filters.price, filters.pickupDate, mapBounds]);

  const cuisineCounts = useMemo(() => {
    const counts = {};
    availableMealsForCuisine.forEach((meal) => {
      counts[meal.cuisine] = (counts[meal.cuisine] || 0) + 1;
    });
    return counts;
  }, [availableMealsForCuisine]);

  // --- Derived Values for Pickup Date Highlights ---
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
      const key = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
      datesSet.add(key);
    });
    return Array.from(datesSet).map((key) => {
      const [year, month, day] = key.split("-").map(Number);
      return new Date(year, month - 1, day);
    });
  }, [availableMealsForPickupDates]);

  // --- Initialize the Cuisine Filter ---
  useEffect(() => {
    if (meals.length > 0 && !initialCuisineSet) {
      setFilters((prev) => ({ ...prev, cuisine: allCuisines }));
      setInitialCuisineSet(true);
    }
  }, [meals, allCuisines, initialCuisineSet]);

  // --- Auto-update Cuisine Filter Based on Map Bounds ---
  // Instead of only unchecking (filtering) out unavailable cuisines,
  // we now set the cuisine filter to include all cuisines available in the current map area.
  useEffect(() => {
    const availableCuisines = allCuisines.filter((cuisine) => (cuisineCounts[cuisine] || 0) > 0);
    setFilters((prev) => ({
      ...prev,
      cuisine: availableCuisines,
    }));
  }, [cuisineCounts, allCuisines]);

  // --- Update Filtered Meals ---
  useEffect(() => {
    console.log("Aktive Filter", filters, "filters.preferences", filters.preferences);
    console.log("Meals:", meals);

    const filtered = meals.filter((meal) => {
      console.log("meal.allergies", meal.allergies); // Log to verify

      if (meal.price > filters.price) return false;
      if (filters.cuisine.length > 0 && !filters.cuisine.includes(meal.cuisine)) return false;

      // Ensure the meal contains all selected preferences (which match allergies)
      if (
        filters.preferences.length > 0 &&
        !filters.preferences.every((preference) => (meal.allergies || []).includes(preference))
      ) {
        return false;
      }

      if (filters.pickupDate && !isSameDay(new Date(meal.pickupTime), filters.pickupDate)) {
        return false;
      }

      return true;
    });

    console.log("Filtered Meals:", filtered); // Debugging output
    setFilteredMeals(filtered);
  }, [filters, meals]);

  // --- Update Visible Meals Based on Map Bounds ---
  // Only show meals that are in the current map bounds.
  const visibleMeals = useMemo(() => {
    if (!mapBounds) return filteredMeals; // If no bounds yet, show all filtered meals.
    return filteredMeals.filter((meal) => {
      const lat = meal.user.address.lat;
      const lng = meal.user.address.long;
      // mapBounds is a Leaflet LatLngBounds, so we can use its contains() method.
      return mapBounds.contains([lat, lng]);
    });
  }, [filteredMeals, mapBounds]);

  // --- Update Map Markers ---
  // Now compute markers based on visibleMeals.
  useEffect(() => {
    const allMarkers = visibleMeals.map((meal) => ({
      geocode: [meal.user.address.lat, meal.user.address.long],
      popUp: (
        <>
          <p className="pop-up">
            🍽️ <strong> Meal:</strong> {meal.title}
          </p>
          <p className="pop-up">
            🧑‍🍳 <strong> Chef:</strong> {meal.user.username}
          </p>
        </>
      ),
    }));
    setMarkers(allMarkers);
  }, [visibleMeals]);

  // --- "Show All"/"Uncheck All" Button ---
  const areAllChecked = useMemo(() => {
    return (
      allCuisines.length > 0 && allCuisines.every((cuisine) => filters.cuisine.includes(cuisine))
    );
  }, [allCuisines, filters.cuisine]);

  const handleCheckAllCuisines = () => {
    if (areAllChecked) {
      setFilters((prev) => ({ ...prev, cuisine: [] }));
    } else {
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

  // --- Callback from the Map Component to update the bounds ---
  const handleBoundsChange = (bounds) => {
    setMapBounds(bounds);
  };

  return (
    <>
      <div>{/* <h1>All Meals Page</h1> */}</div>
      <div id="all-meals-page">
        <div id="mobile-filter-button">
          <button className="filter-button" onClick={() => setShowFilters((prev) => !prev)}>
            {!showFilters ? "Filter Meals" : "Close Filters"}
          </button>
        </div>

        {showFilters && (
          <>
            <div id="left-column">
              <div id="filter">
                <h3>Filter Meals</h3>
                <form>
                  {/* Price Filter */}
                  <label>
                    <legend>Maximal Price</legend>
                    <div className="price-label">
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
                    </div>
                  </label>
                  Cuisine Filter
                  <div>
                    <fieldset>
                      <legend>Cuisine</legend>
                      {allCuisines.map((cuisine, index) => (
                        <div key={index}>
                          <label className="cuisine-label">
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
                            <span className="one-cuisine">
                              {cuisine}
                              <span className="number-of-meals">
                                ({cuisineCounts[cuisine] || 0})
                              </span>
                            </span>
                          </label>
                        </div>
                      ))}
                    </fieldset>
                    <button
                      className="filter-button"
                      type="button"
                      onClick={handleCheckAllCuisines}
                    >
                      {areAllChecked ? "Uncheck All" : "Check All"}
                    </button>
                  </div>
                  {/* Pickup Date Filter */}
                  <div>
                    <label>
                      <legend>Pickup Date</legend>
                      <DatePicker
                        selected={filters.pickupDate}
                        onChange={(date) => setFilters((prev) => ({ ...prev, pickupDate: date }))}
                        placeholderText="Select a pickup date"
                        highlightDates={availablePickupDates}
                        isClearable
                      />
                    </label>
                  </div>
                  {/* Preferences Filter */}
                  <div>
                    <label>
                      <legend>Preferences</legend>
                      {allPreferences.map((preference, index) => (
                        <div key={index}>
                          <label>
                            <input
                              type="checkbox"
                              name="preferences"
                              value={preference}
                              checked={filters.preferences.includes(preference.value)}
                              onChange={() => {
                                console.log("preference.value", preference.value);
                                let newPref = [...filters.preferences];
                                if (newPref.includes(preference.value)) {
                                  newPref = newPref.filter((c) => c !== preference.value);
                                  console.log("newPref", newPref);
                                } else {
                                  newPref.push(preference.value);
                                }
                                setFilters((prev) => ({ ...prev, preferences: newPref }));
                              }}
                            />
                            {preference.label}
                          </label>
                        </div>
                      ))}
                    </label>
                  </div>
                  {/* Reset Filters Button */}
                  <div>
                    <button
                      className="filter-button reset-button"
                      type="button"
                      onClick={resetFilters}
                    >
                      Reset Filters
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </>
        )}

        <div id="right-column">
          <div id="map">
            {/* Pass the handleBoundsChange callback to the Map */}
            <Map markers={markers} onBoundsChange={handleBoundsChange} />
          </div>
          <div id="all-cards">
            {/* Render only the meals currently in view on the map */}
            {visibleMeals.map((meal) => (
              <MealCard key={meal._id} meal={meal} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AllMealsPage;
