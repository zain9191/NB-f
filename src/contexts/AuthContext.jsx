import React, { createContext, useState, useEffect } from "react";
import api from "../utils/api"; // Import API utility

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (localStorage.getItem("token")) {
        try {
          const response = await api.get("/api/profile");
          setUser(response.data);
        } catch (error) {
          console.error("Failed to load user", error);
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post("/api/users/login", { email, password });
      localStorage.setItem("token", response.data.token);
      setUser(response.data.user);
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
