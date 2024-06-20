import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import styled from "styled-components";

const Nav = styled.nav`
  background-color: #4caf50;
  padding: 10px 0;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NavList = styled.ul`
  list-style: none;
  display: flex;
  gap: 20px;
  margin: 0;
  padding: 0;
`;

const NavItem = styled.li`
  margin: 0;
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 18px;

  &:hover {
    text-decoration: underline;
  }
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  console.log("User:", user);
  console.log("Logout function:", logout);
  console.log("Token from localStorage:", localStorage.getItem("token"));

  return (
    <header>
      <Nav>
        <NavList>
          <NavItem>
            <NavLink to="/">Home</NavLink>
          </NavItem>
          {!user ? (
            <>
              <NavItem>
                <NavLink to="/register">Register</NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/login">Login</NavLink>
              </NavItem>
            </>
          ) : (
            <>
              <NavItem>
                <NavLink to="/profile">Profile</NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/meals">Meals</NavLink>
              </NavItem>
              <NavItem>
                <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
              </NavItem>
            </>
          )}
        </NavList>
      </Nav>
    </header>
  );
};

export default Header;
