import "leaflet-geosearch/dist/geosearch.css";

import { useContext, useRef, useEffect, useState } from "react";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import { AddressContext } from "../contexts/address.context";
import { useNavigate } from "react-router-dom";

const AddressSearch = ({ componentId }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]); //Holds the suggested address Drop Down
  const [showDropdown, setShowDropdown] = useState(false);
  const { address, setAddress } = useContext(AddressContext);
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
    setAddress({
      label: suggestion.label,
      lat: suggestion.raw.lat,
      lon: suggestion.raw.lon,
    });
    setShowDropdown(false); // Close the dropdown
    if (componentId === "home") {
      nav("/all-meals");
    }
  };

  return (
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
