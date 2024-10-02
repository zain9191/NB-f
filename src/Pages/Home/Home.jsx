// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import homeBackground from "../../assets/imgs/Home-main.png";
import "./Home.css";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import MealsList from "../../components/MealsList/MealsList";
// import PlacesAutocomplete, {
//   geocodeByAddress,
//   getLatLng,
// } from "react-places-autocomplete";
// src/pages/Home/Home.jsx

import UnifiedSearchBar from "../../components/UnifiedSearchBar/UnifiedSearchBar"; // Adjust the import path
import "./Home.css";

const Home = () => {
  const [searchParams, setSearchParams] = useState({});

  const handleSearch = (params) => {
    setSearchParams(params);
  };

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

          {/* Unified Search Bar */}
          <UnifiedSearchBar onSearch={handleSearch} />
        </div>
      </div>
      <div className="meals-list-section">
        <MealsList searchParams={searchParams} />
      </div>
    </div>
  );
};

export default Home;
