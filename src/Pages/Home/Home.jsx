import React, { useEffect, useState } from "react";
import homeBackground from "../../assets/imgs/Home-main.png";
import "./Home.css";
import MealsList from "../../components/MealsList/MealsList";
import UnifiedSearchBar from "../../components/UnifiedSearchBar/UnifiedSearchBar";

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
