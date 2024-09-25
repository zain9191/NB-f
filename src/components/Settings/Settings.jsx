import React, { useState, useEffect, useContext } from "react";
import api from "../../utils/api";
import { AuthContext } from "../../contexts/AuthContext";
import ProfilePictureUpload from "../ProfilePictureUpload";

const Settings = () => {
  const { user, setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    email: "",
    phone_number: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch user profile data
    const fetchProfile = async () => {
      try {
        const response = await api.get("/api/profile");
        setFormData({
          full_name: response.data.full_name,
          username: response.data.username,
          email: response.data.email,
          phone_number: response.data.phone_number,
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setError("Failed to load profile data.");
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put("/api/profile/update", formData);
      alert("Profile updated successfully.");
      setUser(response.data);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile.");
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setError("New passwords do not match.");
      return;
    }
    try {
      await api.put("/api/profile/change-password", passwordData);
      alert("Password updated successfully.");
    } catch (err) {
      console.error("Error changing password:", err);
      setError("Failed to change password.");
    }
  };

  if (loading) {
    return <p>Loading profile data...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <h2>Profile Picture</h2>
      <ProfilePictureUpload
        onUpload={(url) => setUser({ ...user, profile_picture: url })}
      />

      <form onSubmit={handleSubmit}>
        <div>
          <label>Full Name:</label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Phone Number:</label>
          <input
            type="tel"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Save Changes</button>
      </form>

      <form onSubmit={handlePasswordSubmit}>
        <div>
          <label>Current Password:</label>
          <input
            type="password"
            name="currentPassword"
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
          />
        </div>
        <div>
          <label>New Password:</label>
          <input
            type="password"
            name="newPassword"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
          />
        </div>
        <div>
          <label>Confirm New Password:</label>
          <input
            type="password"
            name="confirmNewPassword"
            value={passwordData.confirmNewPassword}
            onChange={handlePasswordChange}
          />
        </div>
        <button type="submit">Change Password</button>
      </form>
    </>
  );
};

export default Settings;
