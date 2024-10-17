import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../../contexts/CartContext";
import { AuthContext } from "../../contexts/AuthContext";
import UserDropdown from "./UserDropdown";
import foodCart from "../../assets/imgs/food-cart.png";
const NavigationMenu = ({ isMenuOpen, toggleMenu }) => {
  const { user } = useContext(AuthContext);
  const { cart } = useContext(CartContext);

  return (
    <ul className={isMenuOpen ? "header-nav-menu active" : "header-nav-menu"}>
      {user && (
        <li className="header-nav-item">
          <Link
            className="header-nav-link"
            to="/meal-form"
            onClick={toggleMenu}
          >
            Add Meal
          </Link>
        </li>
      )}

      {user && (
        <li className="header-nav-item">
          <Link
            className="header-nav-link cart-link"
            to="/cart"
            onClick={toggleMenu}
          >
            <img src={foodCart} alt="Cart" />
            {cart.length > 0 && (
              <span className="header-cart-count">{cart.length}</span>
            )}
          </Link>
        </li>
      )}

      <li className="header-nav-item">
        <UserDropdown />
      </li>

      <li className="header-nav-item-mobile">
        <Link to="/" onClick={toggleMenu}>
          Home
        </Link>
      </li>
    </ul>
  );
};

export default NavigationMenu;
