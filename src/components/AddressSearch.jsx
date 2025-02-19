import "leaflet-geosearch/dist/geosearch.css";

import { useContext, useRef, useEffect, useState } from "react";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import { AddressContext } from "../contexts/address.context";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/auth.context";

const AddressSearch = ({ componentId, handleAdrChange }) => {
  const [searchTerm, setSearchTerm] = useState(""); //The display term on the field
  const [suggestions, setSuggestions] = useState([]); //Holds the suggested address Drop Down
  const [showDropdown, setShowDropdown] = useState(false); //The ind to show DD of suggested adr
  const { address, setAddress } = useContext(AddressContext);
  const { profileData } = useContext(AuthContext);
  const ref = useRef();
  const nav = useNavigate();

  useEffect(() => {
    async function fillSuggestions(searchStr) {
      const results = await provider.search({ query: searchStr });
      setSuggestions(results);
    }

    if (address.label) {
      setSearchTerm(address.label);
      fillSuggestions(address.label); //Pre-fill the Dropdown
    }
  }, [address]);

  useEffect(() => {
    if (
      (componentId === "meal-form" || componentId === "profile") &&
      profileData.address &&
      profileData.address.displayName
    ) {
      //Pre-set the user address for Address field on Meal & Profile form
      setSearchTerm(profileData.address.displayName);
    }
  }, [profileData.address]);

  useEffect(() => {
    //onClick outside of element close the DD
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        if (document.activeElement.dataset.componentId === componentId) {
          setShowDropdown(false); // Close the dropdown
        }
      }
    }
    // Bind
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Clean up on unmount
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  const provider = new OpenStreetMapProvider({
    params: {
      countrycodes: "de", // Restrict results to Germany
    },
  });

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim().length > 2) {
      // Fetch suggestions from the provider
      try {
        const results = await provider.search({ query: value });
        setSuggestions(results);
        setShowDropdown(true);
      } catch (error) {
        console.error("Error fetching autocomplete address suggestions:", error);
      }
    } else {
      setSuggestions([]); // Clear suggestions for short input
      setShowDropdown(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.label); // Set the selected suggestion in the input field
    setShowDropdown(false); // Close the dropdown

    if (componentId === "profile") {
      handleAdrChange(suggestion.label, suggestion.raw.lat, suggestion.raw.lon);
    } else if (componentId !== "meal-form") {
      setAddress({
        label: suggestion.label,
        lat: suggestion.raw.lat,
        lon: suggestion.raw.lon,
      });
    }

    //If Address added on home page then navigate to All meals
    if (componentId === "home") {
      nav("/all-meals");
    }
  };

  return (
    <div
      className={`${
        componentId === "navbar"
          ? "search-control-container navbar-adr"
          : componentId === "meal-form"
          ? "search-control-container meal-form-adr-cont"
          : componentId === "profile"
          ? " "
          : "search-control-container"
      }`}
    >
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder="Search for an address..."
        disabled={componentId === "meal-form" ? true : false}
        className={`search-control ${
          componentId === "meal-form"
            ? "meal-input input-disabled"
            : componentId === "profile"
            ? "profile-adr-input"
            : " "
        }`}
        onFocus={() => setShowDropdown(true)} // Show dropdown on focus
      />

      {showDropdown && suggestions.length > 0 && (
        <ul className="address-drop-down">
          {suggestions.map((suggestion, index) => (
            <li key={index} onClick={() => handleSuggestionClick(suggestion)} ref={ref}>
              {suggestion.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AddressSearch;
