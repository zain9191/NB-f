import React, { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import useOutsideClick from "../../hooks/useOutsideClick";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

const UserDropdown = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = useRef(null);

  useOutsideClick(dropdownRef, () => setIsOpen(false));

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsOpen(false);
  };

  return (
    <div className="header-dropdown" ref={dropdownRef}>
      <button className="header-dropbtn" onClick={() => setIsOpen(!isOpen)}>
        <FaUserCircle size={24} />
      </button>
      {isOpen && (
        <div className="header-dropdown-content">
          {!user ? (
            <>
              <Link to="/login" onClick={() => setIsOpen(false)}>
                Login
              </Link>
              <Link to="/register" onClick={() => setIsOpen(false)}>
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link to="/profile" onClick={() => setIsOpen(false)}>
                Profile
              </Link>
              <Link to="/settings" onClick={() => setIsOpen(false)}>
                Settings
              </Link>
              <button className="header-logout-button" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
