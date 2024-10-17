// src/contexts/ErrorContext.jsx
import React, { createContext, useState, useContext } from "react";

const ErrorContext = createContext();

export const ErrorProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleError = (error) => {
    console.error("Global Error:", error);
    if (error.response) {
      setError(error.response.data?.message || "An unexpected error occurred.");
    } else if (error.request) {
      setError("No response from server. Please try again later.");
    } else {
      setError("An unexpected error occurred.");
    }

    setTimeout(() => setError(null), 5000);
  };

  const handleSuccess = (message) => {
    setSuccess(message);
    setTimeout(() => setSuccess(null), 3000);
  };

  const clearError = () => setError(null);
  const clearSuccess = () => setSuccess(null);

  return (
    <ErrorContext.Provider
      value={{
        error,
        handleError,
        clearError,
        success,
        handleSuccess,
        clearSuccess,
      }}
    >
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = () => useContext(ErrorContext);
