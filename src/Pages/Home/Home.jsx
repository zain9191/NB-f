// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import homeBackground from "../../assets/imgs/Home-main.png";
import "./Home.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import MealsList from "../../components/MealsList";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";

const AddressAutocomplete = ({ onSearch }) => {
  const [address, setAddress] = useState("");

  const handleSelect = async (value) => {
    setAddress(value);
    try {
      const results = await geocodeByAddress(value);
      const latLng = await getLatLng(results[0]);

      // Extract address components
      const addressComponents = results[0].address_components;

      // Initialize variables
      let city = "";
      let state = "";
      let postalCode = "";

      // Loop through address components
      for (let component of addressComponents) {
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
      }

      // Call the onSearch function with the selected address and coordinates
      onSearch({
        address: value,
        city,
        state,
        postalCode,
        lat: latLng.lat,
        lng: latLng.lng,
      });
    } catch (error) {
      console.error("Error fetching address details:", error);
    }
  };

  return (
    <PlacesAutocomplete
      value={address}
      onChange={setAddress}
      onSelect={handleSelect}
      debounce={300}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <div className="autocomplete-container">
          <div className="autocomplete-icon">
            <FontAwesomeIcon icon={faLocationDot} />
          </div>
          <div className="autocomplete-icon-div">
            <input
              {...getInputProps({
                placeholder: "Enter your address",
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
          <button className="home-find-button">Find Meals</button>
        </div>
      )}
    </PlacesAutocomplete>
  );
};

const Home = () => {
  const [searchParams, setSearchParams] = useState({
    address: "",
    city: "",
    state: "",
    postalCode: "",
    coordinates: { lat: null, lng: null },
  });

  const handleSearch = (params) => {
    setSearchParams(params);
  };

  // delete after
  useEffect(() => {
    console.log(searchParams);
  }, [searchParams]);

  return (
    <div className="home-main-div">
      <div className="hero-section">
        <img
          src={homeBackground}
          alt="Home Background"
          className="hero-image"
        />
        <div className="hero-content">
          <h1>Gourmet dishes created by talented local chefs</h1>
          <p>Discover nutritious, premium meals in your neighborhood.</p>
          <AddressAutocomplete onSearch={handleSearch} />
        </div>
      </div>
      <div className="meals-list-section">
        <MealsList searchParams={searchParams} />
        {console.log(searchParams)}
      </div>
    </div>
  );
};

export default Home;
