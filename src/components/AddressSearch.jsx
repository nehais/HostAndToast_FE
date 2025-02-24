import "leaflet-geosearch/dist/geosearch.css";
import { useContext, useRef, useEffect, useState } from "react";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import { AddressContext } from "../contexts/address.context";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/auth.context";

const AddressSearch = ({ componentId, handleAdrChange }) => {
  const [changed, setChanged] = useState(false); // The display term on the field
  const [searchTerm, setSearchTerm] = useState(""); // The display term on the field
  const [suggestions, setSuggestions] = useState([]); // Holds the suggested addresses
  const [showDropdown, setShowDropdown] = useState(false); // To control the dropdown visibility
  const { address, setAddress } = useContext(AddressContext);
  const { profileData } = useContext(AuthContext);
  const ref = useRef();
  const nav = useNavigate();
  const debounceTimeout = useRef(null); // Holds the debounce timeout reference

  const provider = new OpenStreetMapProvider({
    //params: {
    //countrycodes: "de", // Restrict results to Germany
    //},
  });

  // Function to fetch address suggestions
  const fetchSuggestions = async (query) => {
    if (!query || query.trim().length <= 2) {
      setSuggestions([]); // Clear suggestions if input is too short
      setShowDropdown(false);
      return;
    }

    try {
      const results = await provider.search({ query });
      setSuggestions(results);
      setShowDropdown(true);
    } catch (error) {
      console.error("Error fetching address suggestions:", error);
    }
  };

  // Debounce effect to delay API call
  useEffect(() => {
    if (!changed) return;

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      fetchSuggestions(searchTerm);
    }, 500); // 500ms delay

    return () => clearTimeout(debounceTimeout.current);
  }, [searchTerm]);

  // Preset search field when address is available
  useEffect(() => {
    if (address.label) {
      setSearchTerm(address.label);
    }
  }, [address]);

  // Set user profile address in the input field (if applicable)
  useEffect(() => {
    if (
      (componentId === "meal-form" || componentId === "profile") &&
      profileData.address &&
      profileData.address.displayName
    ) {
      setSearchTerm(profileData.address.displayName);
    }
  }, [profileData.address]);

  // Handle clicks outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    setChanged(true);
    setSearchTerm(e.target.value);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.label);
    setShowDropdown(false);

    if (componentId === "profile") {
      handleAdrChange(suggestion.label, suggestion.raw.lat, suggestion.raw.lon);
    } else if (componentId !== "meal-form") {
      setAddress({
        label: suggestion.label,
        lat: suggestion.raw.lat,
        lon: suggestion.raw.lon,
      });
    }

    if (componentId === "home") {
      nav("/all-meals");
    }
  };

  return (
    <div
      ref={ref} // Apply ref here
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
        disabled={componentId === "meal-form"}
        className={`search-control ${
          componentId === "meal-form"
            ? "meal-input input-disabled"
            : componentId === "profile"
            ? "profile-adr-input"
            : ""
        }`}
        onFocus={() => setShowDropdown(true)}
      />

      {showDropdown && suggestions.length > 0 && (
        <ul className="address-drop-down" ref={ref}>
          {suggestions.map((suggestion, index) => (
            <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
              {suggestion.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AddressSearch;
