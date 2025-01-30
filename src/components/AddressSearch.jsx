import "leaflet-geosearch/dist/geosearch.css";

import { useContext, useRef, useEffect, useState } from "react";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import { AddressContext } from "../contexts/address.context";

const AddressSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]); //Holds the suggested address Drop Down
  const [showDropdown, setShowDropdown] = useState(false);
  const { setAddress } = useContext(AddressContext);
  const ref = useRef();

  useEffect(() => {
    //onClick outside of element close the DD
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setShowDropdown(false); // Close the dropdown
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
        console.error(
          "Error fetching autocomplete address suggestions:",
          error
        );
      }
    } else {
      setSuggestions([]); // Clear suggestions for short input
      setShowDropdown(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.label); // Set the selected suggestion in the input field
    setAddress({
      label: suggestion.label,
      lat: suggestion.raw.lat,
      lon: suggestion.raw.lon,
    });
    setShowDropdown(false); // Close the dropdown
  };

  return (
    <div className="address-container">
      <div className="search-control-container">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="Search for an address..."
          className="search-control"
          onFocus={() => setShowDropdown(true)} // Show dropdown on focus
        />

        {showDropdown && suggestions.length > 0 && (
          <ul className="address-drop-down">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                onBlur={(e) => {
                  e.preventDefault();
                  setShowDropdown(false);
                }} // Prevent blur on click
                ref={ref}
              >
                {suggestion.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AddressSearch;
