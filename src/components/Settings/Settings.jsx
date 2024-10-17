// src/components/Settings/Settings.jsx
import React, { useEffect, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import api from "../../utils/api";
import { AuthContext } from "../../contexts/AuthContext";

const Settings = () => {
  const { user, setUser } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get("/api/auth");
        const userData = response.user || response.data.user || response.data;
        setUser(userData);
        reset({
          fullName: userData.fullName,
          username: userData.username,
          email: userData.email,
          phoneNumber: userData.phoneNumber,
        });
      } catch (error) {
        console.error("Error fetching settings:", error);
        alert("Failed to load settings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [reset, setUser]);

  const onSubmit = async (data) => {
    setUpdating(true);
    try {
      const response = await api.put("/api/auth", data);
      if (response.success) {
        setUser(response.data.user || response.data || response);
        alert("Settings updated successfully!");
      } else {
        alert(response.msg || "Failed to update settings.");
      }
    } catch (error) {
      console.error("Error updating settings:", error);
      alert("An error occurred while updating settings. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p>Loading settings...</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="settings-form">
      <div className="form-group">
        <label htmlFor="full_name">Full Name</label>
        <input
          id="full_name"
          type="text"
          {...register("full_name", { required: "Full name is required" })}
          placeholder="Full Name"
          className={errors.full_name ? "input-error" : ""}
        />
        {errors.full_name && (
          <p className="error-message">{errors.full_name.message}</p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          {...register("username", { required: "Username is required" })}
          placeholder="Username"
          className={errors.username ? "input-error" : ""}
        />
        {errors.username && (
          <p className="error-message">{errors.username.message}</p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email address",
            },
          })}
          placeholder="Email"
          className={errors.email ? "input-error" : ""}
        />
        {errors.email && (
          <p className="error-message">{errors.email.message}</p>
        )}
      </div>

      {/* Add other fields as necessary */}

      <button type="submit" disabled={updating}>
        {updating ? "Updating..." : "Update Settings"}
      </button>
    </form>
  );
};

export default Settings;
