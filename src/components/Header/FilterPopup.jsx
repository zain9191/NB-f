import React, { useRef } from "react";
import useOutsideClick from "../../hooks/useOutsideClick";

const FilterPopup = ({
  isFilterOpen,
  toggleFilterPopup,
  filters,
  handleFilterChange,
  filterOptions,
}) => {
  const popupRef = useRef(null);

  useOutsideClick(popupRef, () => {
    if (isFilterOpen) toggleFilterPopup();
  });

  if (!isFilterOpen) return null;

  return (
    <div className="header-filter-popup" ref={popupRef}>
      <div className="header-filter-popup-content">
        <h3>Filters</h3>
        <select
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
          className="header-filter-select"
        >
          <option value="">Category</option>
          {filterOptions.categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <select
          name="cuisine"
          value={filters.cuisine}
          onChange={handleFilterChange}
          className="header-filter-select"
        >
          <option value="">Cuisine</option>
          {filterOptions.cuisines.map((cuisine) => (
            <option key={cuisine} value={cuisine}>
              {cuisine}
            </option>
          ))}
        </select>
        <select
          name="dietaryRestrictions"
          value={filters.dietaryRestrictions}
          onChange={handleFilterChange}
          className="header-filter-select"
        >
          <option value="">Dietary Restrictions</option>
          {filterOptions.dietaryRestrictions.map((restriction) => (
            <option key={restriction} value={restriction}>
              {restriction}
            </option>
          ))}
        </select>
        <select
          name="pickupDeliveryOptions"
          value={filters.pickupDeliveryOptions}
          onChange={handleFilterChange}
          className="header-filter-select"
        >
          <option value="">Pickup/Delivery Options</option>
          {filterOptions.pickupDeliveryOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <select
          name="paymentOptions"
          value={filters.paymentOptions}
          onChange={handleFilterChange}
          className="header-filter-select"
        >
          <option value="">Payment Options</option>
          {filterOptions.paymentOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="header-apply-filters-button"
          onClick={toggleFilterPopup}
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default FilterPopup;
