import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import config from "../config"; // Import the configuration

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        console.log("Token found in localStorage:", token);
        try {
          const res = await axios.get(`${config.apiBaseUrl}/api/auth`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.data && res.data._id) {
            // Adjusting to the actual response structure
            setUser(res.data);
            console.log("Fetched user:", res.data);
          } else {
            console.log("No user data found in response:", res.data);
            setUser(null);
          }
        } catch (err) {
          console.error("Error fetching user:", err);
          setUser(null);
        }
      } else {
        console.log("No token found in localStorage.");
      }
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      console.log("Attempting login with email:", email);
      const res = await axios.post(`${config.apiBaseUrl}/api/auth/login`, {
        email,
        password,
      });
      if (res.data && res.data.token) {
        localStorage.setItem("token", res.data.token);
        setUser(res.data.user);
        console.log("Login successful. User data:", res.data.user);
      } else {
        console.log("Login response missing token or user data:", res.data);
      }
    } catch (err) {
      console.error("Error during login:", err);
      throw err;
    }
  };

  const logout = () => {
    console.log("Logging out user:", user);
    localStorage.removeItem("token");
    setUser(null);
    console.log("User logged out successfully.");
  };

  useEffect(() => {
    console.log("User state changed:", user);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
