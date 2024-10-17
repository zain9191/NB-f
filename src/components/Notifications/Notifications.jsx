// src/components/Notifications/Notifications.jsx
import React from "react";
import { useError } from "../../contexts/ErrorContext";
import "./Notifications.css";

const Notifications = () => {
  const { error, success, clearError, clearSuccess } = useError();

  return (
    <div className="notifications-container">
      {error && (
        <div className="notification error">
          <span>{error}</span>
          <button onClick={clearError} aria-label="Close Error Notification">
            &times;
          </button>
        </div>
      )}
      {success && (
        <div className="notification success">
          <span>{success}</span>
          <button
            onClick={clearSuccess}
            aria-label="Close Success Notification"
          >
            &times;
          </button>
        </div>
      )}
    </div>
  );
};

export default Notifications;
