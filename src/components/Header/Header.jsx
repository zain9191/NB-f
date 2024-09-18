import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import "./Header.css";
import smallCart from "../../assets/imgs/food-cart.png";
import { CartContext } from "../../contexts/CartContext";

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { cart } = useContext(CartContext); // Get cart from context

  // State for search input and filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    cuisine: "",
    dietaryRestrictions: "",
  });

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Handle search input change
  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  // Handle search form submission
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
  };

  return (
    <header>
      <nav className="header--navbar">
        <ul className="header--nav-list">
          <li className="header--nav-item">
            <Link className="header--nav-link" to="/">
              Home
            </Link>
          </li>
          {!user ? (
            <>
              <li className="header--nav-item">
                <Link className="header--nav-link" to="/register">
                  Register
                </Link>
              </li>
              <li className="header--nav-item">
                <Link className="header--nav-link" to="/login">
                  Login
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className="header--nav-item">
                <Link className="header--nav-link" to="/profile">
                  Profile
                </Link>
              </li>
              <li className="header--nav-item">
                <Link className="header--nav-link" to="/meals">
                  Meals
                </Link>
              </li>
              <li className="header--nav-item">
                <button
                  className="header--logout-button"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>

        <div className="header--cart">
          <Link to="/cart">
            <img src={smallCart} className="smallCart" alt="Cart" />
            {cart.length > 0 && <span>({cart.length})</span>}{" "}
            {/* Show cart item count */}
          </Link>
        </div>
      </nav>
      {user && (
        <div className="header--nav-item" style={{ textAlign: "center" }}>
          <Link className="header--nav-link" to="/add-meal">
            Add Meal
          </Link>
        </div>
      )}
      <div className="header--search-container">
        <form className="header--search-form" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search meals..."
            value={searchQuery}
            onChange={handleInputChange}
            className="header--search-input"
          />
          {/* Filters */}
          <select
            name="cuisine"
            value={filters.cuisine}
            onChange={handleFilterChange}
            className="header--search-select"
          >
            <option value="">Cuisine</option>
            <option value="Italian">Italian</option>
            <option value="Chinese">Chinese</option>
          </select>
          <select
            name="dietaryRestrictions"
            value={filters.dietaryRestrictions}
            onChange={handleFilterChange}
            className="header--search-select"
          >
            <option value="">Dietary Restrictions</option>
            <option value="Vegan">Vegan</option>
            <option value="Gluten-Free">Gluten-Free</option>
          </select>
          <button type="submit" className="header--search-button">
            Search
          </button>
        </form>
      </div>
    </header>
  );
};

export default Header;
