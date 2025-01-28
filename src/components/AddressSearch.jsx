import React, { useState } from "react";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet-geosearch/dist/geosearch.css";

const AddressSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

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
        console.error("Error fetching autocomplete suggestions:", error);
      }
    } else {
      setSuggestions([]); // Clear suggestions for short input
      setShowDropdown(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.label); // Set the selected suggestion in the input field
    setShowDropdown(false); // Close the dropdown
    console.log("Selected address:", suggestion); // You can handle further actions here
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "0 auto" }}>
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder="Search for an address..."
        style={{
          width: "100%",
          padding: "10px",
          fontSize: "16px",
          borderRadius: "8px",
          border: "1px solid #ccc",
        }}
        onFocus={() => setShowDropdown(true)} // Show dropdown on focus
      />

      {showDropdown && suggestions.length > 0 && (
        <ul
          style={{
            listStyleType: "none",
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            marginTop: "5px",
            maxHeight: "200px",
            overflowY: "auto",
            color: "white",
            backgroundColor: "transparent",
            position: "absolute",
            zIndex: 1000,
          }}
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              style={{
                padding: "10px",
                cursor: "pointer",
                borderBottom: "1px solid #eee",
              }}
              onMouseDown={(e) => e.preventDefault()} // Prevent blur on click
            >
              {suggestion.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AddressSearch;
