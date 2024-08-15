import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import "./Header.css";
import smallCart from "../../assets/imgs/food-cart.png";

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
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
        <Link to="/cart">
          <img src={smallCart} className="smallCart" alt="Cart" />
        </Link>
      </nav>
      {/* // In Header or somewhere appropriate */}
      {user && (
        <li className="header--nav-item">
          <Link className="header--nav-link" to="/add-meal">
            Add Meal
          </Link>
        </li>
      )}
    </header>
  );
};

export default Header;
