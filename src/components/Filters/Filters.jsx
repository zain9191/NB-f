import React, { useState, useEffect } from "react";
import "./Filters.css";

const Filters = ({ onApplyFilters, onResetFilters, filterOptions }) => {
  // States for filters
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedDietaryRestrictions, setSelectedDietaryRestrictions] =
    useState([]);
  const [pickupDeliveryOption, setPickupDeliveryOption] = useState("both");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [distance, setDistance] = useState(10);
  const [sortBy, setSortBy] = useState("");

  const handleCheckboxChange = (e, setState) => {
    const { value, checked } = e.target;
    setState((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value)
    );
  };

  const handlePickupDeliveryChange = (e) => {
    setPickupDeliveryOption(e.target.value);
  };

  const handleApplyFilters = () => {
    const filters = {
      cuisine: selectedCuisines,
      category: selectedCategories,
      dietaryRestrictions: selectedDietaryRestrictions,
      pickupDeliveryOption,
      minPrice,
      maxPrice,
      distance,
      sortBy,
    };
    onApplyFilters(filters);
  };

  const handleResetFilters = () => {
    setSelectedCuisines([]);
    setSelectedCategories([]);
    setSelectedDietaryRestrictions([]);
    setPickupDeliveryOption("both");
    setMinPrice("");
    setMaxPrice("");
    setDistance(10);
    setSortBy("");
    onResetFilters();
  };

  return (
    <div className="filters-container">
      <h2>Filters</h2>

      <div className="filter-section">
        <h3>Cuisine</h3>
        {filterOptions.cuisines?.map((cuisine) => (
          <label key={cuisine}>
            <input
              type="checkbox"
              value={cuisine}
              checked={selectedCuisines.includes(cuisine)}
              onChange={(e) => handleCheckboxChange(e, setSelectedCuisines)}
            />
            {cuisine}
          </label>
        ))}
      </div>

      <div className="filter-section">
        <h3>Category</h3>
        {filterOptions.categories?.map((category) => (
          <label key={category}>
            <input
              type="checkbox"
              value={category}
              checked={selectedCategories.includes(category)}
              onChange={(e) => handleCheckboxChange(e, setSelectedCategories)}
            />
            {category}
          </label>
        ))}
      </div>

      <div className="filter-section">
        <h3>Dietary Restrictions</h3>
        {filterOptions.dietaryRestrictions?.map((restriction) => (
          <label key={restriction}>
            <input
              type="checkbox"
              value={restriction}
              checked={selectedDietaryRestrictions.includes(restriction)}
              onChange={(e) =>
                handleCheckboxChange(e, setSelectedDietaryRestrictions)
              }
            />
            {restriction}
          </label>
        ))}
      </div>

      <div className="filter-section">
        <h3>Pickup/Delivery Options</h3>
        <label>
          <input
            type="radio"
            value="both"
            checked={pickupDeliveryOption === "both"}
            onChange={handlePickupDeliveryChange}
          />
          Both
        </label>
        {filterOptions.pickupDeliveryOptions?.map((option) => (
          <label key={option}>
            <input
              type="radio"
              value={option}
              checked={pickupDeliveryOption === option}
              onChange={handlePickupDeliveryChange}
            />
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </label>
        ))}
      </div>

      <div className="filter-section">
        <h3>Price Range</h3>
        <label>
          Min Price:
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            min="0"
          />
        </label>
        <label>
          Max Price:
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            min="0"
          />
        </label>
      </div>

      <div className="filter-section">
        <h3>Distance (km)</h3>
        <input
          type="number"
          value={distance}
          onChange={(e) => setDistance(e.target.value)}
          min="1"
          max="100"
        />
      </div>

      <div className="filter-section">
        <h3>Sort By</h3>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="">Select</option>
          <option value="priceAsc">Price - Low to High</option>
          <option value="priceDesc">Price - High to Low</option>
          <option value="rating">Rating</option>
          <option value="newest">Newest</option>
        </select>
      </div>

      <div className="filter-buttons">
        <button onClick={handleApplyFilters}>Apply Filters</button>
        <button onClick={handleResetFilters}>Reset Filters</button>
      </div>
    </div>
  );
};

export default Filters;
