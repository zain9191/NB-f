// File: src/components/Header/Header.jsx

import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { CartContext } from "../../contexts/CartContext";
import api from "../../utils/api";
import "./Header.css";

import smallCart from "../../assets/imgs/food-cart.png";
import { FaBars, FaTimes } from "react-icons/fa";

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { cart } = useContext(CartContext);

  // State for menu toggle
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // State for search input and filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    cuisine: "",
    dietaryRestrictions: "",
    pickupDeliveryOptions: "",
    paymentOptions: "",
  });

  // State for filter popup
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // State for filter options
  const [filterOptions, setFilterOptions] = useState({
    categories: [],
    cuisines: [],
    dietaryRestrictions: [],
    pickupDeliveryOptions: [],
    paymentOptions: [],
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await api.get("/api/meals/filters");
        setFilterOptions(response.data);
      } catch (error) {
        console.error("Error fetching filter options:", error);
      }
    };
    fetchFilterOptions();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsMenuOpen(false); // Close the menu after logout
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Construct query parameters
    const params = new URLSearchParams();
    if (searchQuery) params.append("search", searchQuery);
    Object.keys(filters).forEach((key) => {
      if (filters[key]) params.append(key, filters[key]);
    });
    // Navigate to the meals page with query parameters
    navigate(`/meals?${params.toString()}`);
    setIsMenuOpen(false); // Close the menu after search
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleFilterPopup = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdown = document.querySelector(".header-dropdown-content");
      const dropdownButton = document.querySelector(".header-dropbtn");
      if (
        dropdown &&
        !dropdown.contains(event.target) &&
        !dropdownButton.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }

      const filterPopup = document.querySelector(".header-filter-popup");
      const filterButton = document.querySelector(".header-filter-button");
      if (
        filterPopup &&
        !filterPopup.contains(event.target) &&
        !filterButton.contains(event.target)
      ) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="header">
      {/* Navbar */}
      <nav className="header-navbar">
        <div className="header-navbar-container">
          {/* Logo */}
          <div className="header-logo">
            <Link to="/">Home</Link>
          </div>

          {/* Mobile Menu Icon */}
          <div className="header-menu-icon" onClick={toggleMenu}>
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </div>

          {/* Navigation Links */}
          <ul
            className={
              isMenuOpen ? "header-nav-menu active" : "header-nav-menu"
            }
          >
            {/* If user is logged in, show Add Meal link */}
            {user && (
              <li className="header-nav-item">
                <Link
                  className="header-nav-link"
                  to="/add-meal"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Add Meal
                </Link>
              </li>
            )}

            {/* Cart Icon - Only show when user is logged in */}
            {user && (
              <li className="header-nav-item">
                <Link
                  className="header-nav-link cart-link"
                  to="/cart"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <img src={smallCart} alt="Cart" />
                  {cart.length > 0 && (
                    <span className="header-cart-count">{cart.length}</span>
                  )}
                </Link>
              </li>
            )}

            {/* Dropdown Menu */}
            <li className="header-nav-item">
              <div className="header-dropdown">
                <button className="header-dropbtn" onClick={toggleDropdown}>
                  Menu
                </button>
                {isDropdownOpen && (
                  <div className="header-dropdown-content">
                    {!user ? (
                      <>
                        <Link
                          to="/login"
                          onClick={() => {
                            setIsDropdownOpen(false);
                            setIsMenuOpen(false);
                          }}
                        >
                          Login
                        </Link>
                        <Link
                          to="/register"
                          onClick={() => {
                            setIsDropdownOpen(false);
                            setIsMenuOpen(false);
                          }}
                        >
                          Sign Up
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/profile"
                          onClick={() => {
                            setIsDropdownOpen(false);
                            setIsMenuOpen(false);
                          }}
                        >
                          Profile
                        </Link>
                        <Link
                          to="/settings"
                          onClick={() => {
                            setIsDropdownOpen(false);
                            setIsMenuOpen(false);
                          }}
                        >
                          Settings
                        </Link>
                        <button
                          className="header-logout-button"
                          onClick={handleLogout}
                        >
                          Logout
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </li>
          </ul>
        </div>
      </nav>

      {/* Search and Filters - Only show when user is logged in */}
      {user && (
        <div className="header-search-container">
          <form className="header-search-form" onSubmit={handleSearchSubmit}>
            <div className="header-search-inputs">
              <input
                type="text"
                placeholder="Search meals..."
                value={searchQuery}
                onChange={handleInputChange}
                className="header-search-input"
              />
            </div>

            <div className="header-search-buttons">
              <button
                type="button"
                className="header-filter-button"
                onClick={toggleFilterPopup}
              >
                Filters
              </button>
              <button type="submit" className="header-search-button">
                Search
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter Popup */}
      {isFilterOpen && (
        <div className="header-filter-popup">
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
      )}
    </header>
  );
};

export default Header;
