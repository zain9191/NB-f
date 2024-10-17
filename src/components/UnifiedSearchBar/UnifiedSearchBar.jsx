import React, { useState } from "react";
import PropTypes from "prop-types";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import "./UnifiedSearchBar.css";

const UnifiedSearchBar = ({ onSearch }) => {
  const [searchInput, setSearchInput] = useState("");

  const handleSelect = async (value) => {
    setSearchInput(value);

    try {
      const results = await geocodeByAddress(value);
      const latLng = await getLatLng(results[0]);

      const addressComponents = results[0].address_components;
      let city = "";
      let state = "";
      let postalCode = "";

      addressComponents.forEach((component) => {
        const types = component.types;
        if (types.includes("locality")) {
          city = component.long_name;
        }
        if (types.includes("administrative_area_level_1")) {
          state = component.short_name;
        }
        if (types.includes("postal_code")) {
          postalCode = component.long_name;
        }
      });

      onSearch({
        search: "",
        address: value,
        city,
        state,
        postalCode,
        coordinates: { lat: latLng.lat, lng: latLng.lng },
        radius: 10000,
      });
    } catch (error) {
      console.error("Error fetching address details:", error);
    }
  };

  const handleChange = (value) => {
    setSearchInput(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!searchInput.trim()) return;

    try {
      const results = await geocodeByAddress(searchInput);
      const latLng = await getLatLng(results[0]);

      const addressComponents = results[0].address_components;
      let city = "";
      let state = "";
      let postalCode = "";

      addressComponents.forEach((component) => {
        const types = component.types;
        if (types.includes("locality")) {
          city = component.long_name;
        }
        if (types.includes("administrative_area_level_1")) {
          state = component.short_name;
        }
        if (types.includes("postal_code")) {
          postalCode = component.long_name;
        }
      });

      onSearch({
        search: "",
        address: searchInput,
        city,
        state,
        postalCode,
        coordinates: { lat: latLng.lat, lng: latLng.lng },
        radius: 10000,
      });
    } catch (error) {
      onSearch({
        search: searchInput,
        coordinates: null,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="unified-search-form">
      <PlacesAutocomplete
        value={searchInput}
        onChange={handleChange}
        onSelect={handleSelect}
        debounce={300}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div className="autocomplete-container">
            <input
              {...getInputProps({
                placeholder: "Search meals or address...",
                className: "autocomplete-input",
              })}
              required
            />
            {suggestions.length > 0 && (
              <div className="autocomplete-dropdown">
                {loading && <div>Loading...</div>}
                {suggestions.map((suggestion) => {
                  const active = suggestion.active;
                  return (
                    <div
                      {...getSuggestionItemProps(suggestion, {
                        className: `suggestion-item ${
                          active ? "active-custom" : ""
                        }`,
                      })}
                      key={suggestion.placeId}
                    >
                      {suggestion.description}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </PlacesAutocomplete>
      <button type="submit" className="search-button">
        Search
      </button>
    </form>
  );
};

UnifiedSearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
};

export default UnifiedSearchBar;
