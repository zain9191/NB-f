// React and React dependencies
import React, { useContext, useState, useEffect } from "react";

// External libraries
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

// Contexts
import { AuthContext } from "../../contexts/AuthContext";
import { CartContext } from "../../contexts/CartContext";

// Utilities
import api from "../../utils/api";

// Components
import NavigationMenu from "./NavigationMenu";
import SearchBar from "./SearchBar";
import FilterPopup from "./FilterPopup";

// Styles
import "./Header.css";

const Header = () => {
  // Contexts
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);

  // Router
  const navigate = useNavigate();

  // State variables
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    cuisine: "",
    dietaryRestrictions: "",
    pickupDeliveryOptions: "",
    paymentOptions: "",
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    categories: [],
    cuisines: [],
    dietaryRestrictions: [],
    pickupDeliveryOptions: [],
    paymentOptions: [],
  });

  // Effects
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await api.get("/api/meals/filters");
        setFilterOptions(response.data.data); // Removed .data as per the request
      } catch (error) {
        console.error("Error fetching filter options:", error);
      }
    };
    fetchFilterOptions();
  }, []);

  // Handlers
  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsMenuOpen(false);
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
    const params = new URLSearchParams();
    if (searchQuery) params.append("search", searchQuery);
    Object.keys(filters).forEach((key) => {
      if (filters[key]) params.append(key, filters[key]);
    });
    navigate(`/meals?${params.toString()}`);
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleFilterPopup = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  // Render
  return (
    <header className="header">
      <nav className="header-navbar">
        <div className="header-navbar-container">
          <div className="header-logo">
            <Link to="/">Home</Link>
          </div>

          <div className="header-menu-icon" onClick={toggleMenu}>
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </div>

          <NavigationMenu isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
        </div>
      </nav>

      {user && (
        <SearchBar
          searchQuery={searchQuery}
          handleInputChange={handleInputChange}
          handleSearchSubmit={handleSearchSubmit}
          toggleFilterPopup={toggleFilterPopup}
        />
      )}

      {user && (
        <FilterPopup
          isFilterOpen={isFilterOpen}
          toggleFilterPopup={toggleFilterPopup}
          filters={filters}
          handleFilterChange={handleFilterChange}
          filterOptions={filterOptions}
        />
      )}
    </header>
  );
};

export default Header;
