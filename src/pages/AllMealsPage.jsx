import { useEffect, useMemo, useState } from "react";
import MealCard from "../components/MealCard";
import "../styles/AllMealsPage.css";
import axios from "axios";
import { API_URL } from "../config/apiConfig.js";
import Map from "../components/Map.jsx";

const AllMealsPage = () => {
  const [meals, setMeals] = useState([]);
  const [filteredMeals, setFilteredMeals] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [filters, setFilters] = useState({
    price: 20, // initial price value (will be adjusted once meals load)
    cuisine: [], // selected cuisines; on initial load, all cuisines will be selected
  });
  // This flag ensures we set the cuisine filter only once on initial load.
  const [initialCuisineSet, setInitialCuisineSet] = useState(false);

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

  // --- Global Values (Fixed: All Meals) ---
  // All cuisines from all meals.
  const allCuisines = useMemo(() => {
    return [...new Set(meals.map((meal) => meal.cuisine))];
  }, [meals]);

  // Maximum price from all meals.
  const allMaxPrice = useMemo(() => {
    return meals.reduce((max, meal) => Math.max(max, meal.price), 0);
  }, [meals]);

  // --- Derived Values Based on the Price Filter Only ---
  // Compute the meals that satisfy the current price filter.
  const availableMealsForCuisine = useMemo(() => {
    return meals.filter((meal) => meal.price <= filters.price);
  }, [meals, filters.price]);

  // From those meals, determine which cuisines are available.
  const availableCuisinesFromPrice = useMemo(() => {
    return [...new Set(availableMealsForCuisine.map((meal) => meal.cuisine))];
  }, [availableMealsForCuisine]);

  // Compute counts for each cuisine based on the current price filter.
  const cuisineCounts = useMemo(() => {
    const counts = {};
    availableMealsForCuisine.forEach((meal) => {
      counts[meal.cuisine] = (counts[meal.cuisine] || 0) + 1;
    });
    return counts;
  }, [availableMealsForCuisine]);

  // --- Initialize the Cuisine Filter ---
  // On first load, select all cuisines.
  useEffect(() => {
    if (meals.length > 0 && !initialCuisineSet) {
      setFilters((prev) => ({ ...prev, cuisine: allCuisines }));
      setInitialCuisineSet(true);
    }
  }, [meals, allCuisines, initialCuisineSet]);

  // --- Update the Selected Cuisines When the Price Filter Changes ---
  // Remove any selected cuisine that is no longer available under the current price filter.
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      cuisine: prev.cuisine.filter((cuisine) => availableCuisinesFromPrice.includes(cuisine)),
    }));
  }, [availableCuisinesFromPrice]);

  // --- Update the Filtered Meals Based on Current Filters ---
  useEffect(() => {
    const filtered = meals.filter((meal) => {
      // Price filter: meal must be within the max price.
      if (meal.price > filters.price) return false;
      // Cuisine filter: meal's cuisine must be among the selected cuisines.
      if (filters.cuisine.length === 0 || !filters.cuisine.includes(meal.cuisine)) return false;
      return true;
    });
    setFilteredMeals(filtered);
  }, [filters, meals]);

  // --- Update Map Markers Based on Filtered Meals ---
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

  // --- Determine Button Label and Functionality for Cuisines ---
  // The button will work with cuisines available under the current price filter.
  const areAllAvailableChecked = useMemo(() => {
    return (
      availableCuisinesFromPrice.length > 0 &&
      availableCuisinesFromPrice.every((cuisine) => filters.cuisine.includes(cuisine)) &&
      filters.cuisine.length === availableCuisinesFromPrice.length
    );
  }, [availableCuisinesFromPrice, filters.cuisine]);

  const handleCheckAllCuisines = () => {
    if (areAllAvailableChecked) {
      // Uncheck all: remove all cuisines that are available under current price.
      setFilters((prev) => ({ ...prev, cuisine: [] }));
    } else {
      // Check all: select all cuisines that are available under current price.
      setFilters((prev) => ({ ...prev, cuisine: availableCuisinesFromPrice }));
    }
  };

  // --- Reset Filters Button ---
  const resetFilters = () => {
    setFilters({
      price: allMaxPrice,
      cuisine: allCuisines,
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
                  {areAllAvailableChecked ? "Uncheck All" : "Show All"}
                </button>
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
