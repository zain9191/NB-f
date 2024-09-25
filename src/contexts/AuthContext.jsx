// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import api from "../utils/api";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // In src/contexts/AuthContext.jsx
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await api.get("/api/auth");
          if (res.data && res.data._id) {
            setUser(res.data);
          } else {
            console.log("No user data found in response:", res.data);
            setUser(null);
          }
        } catch (err) {
          console.error("Error fetching user:", err);
          if (err.response && err.response.status === 401) {
            // Token is invalid or expired
            localStorage.removeItem("token");
            setUser(null);
          }
        }
      } else {
        console.log("No token found in localStorage.");
      }
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post("/api/auth/login", {
        email,
        password,
      });
      if (res.data && res.data.token) {
        localStorage.setItem("token", res.data.token);
        setUser(res.data.user);
      } else {
        console.log("Login response missing token or user data:", res.data);
      }
    } catch (err) {
      console.error("Error during login:", err);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    console.log("User logged out successfully.");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
