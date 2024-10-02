// src/components/Profile/Profile.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddressForm from "../AddressForm";
import api from "../../utils/api";
import ProfilePictureUpload from "../ProfilePictureUpload";
import MealCard from "../MealCard/MealCard";

import "./Profile.css";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [error, setError] = useState(null);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressError, setAddressError] = useState(null);
  const [userMeals, setUserMeals] = useState([]);

  // State variables for "Become a Chef" functionality
  const [isBecomingChef, setIsBecomingChef] = useState(false);
  const [becomeChefError, setBecomeChefError] = useState(null);
  const [becomeChefSuccess, setBecomeChefSuccess] = useState(null);
  const [showChefModal, setShowChefModal] = useState(false);
  const [chefSpecialty, setChefSpecialty] = useState("");
  const [specialtyError, setSpecialtyError] = useState(null);

  const navigate = useNavigate();

  // Centralized fetch logic with token validation
  const fetchWithAuth = async (method, url, data = null, options = {}) => {
    try {
      const response = await api({
        method,
        url,
        data,
        ...options,
      });
      return response;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate("/home");
      }
      throw error;
    }
  };

  // Fetch the user's profile
  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await fetchWithAuth("get", "/api/auth");
      setProfile(response.data);

      // Fetch addresses after profile is loaded
      await fetchAddresses();
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch the user's addresses
  const fetchAddresses = async () => {
    try {
      const response = await fetchWithAuth("get", "/api/address");
      if (response && response.data && response.data.success) {
        setAddresses(response.data.data);
      } else {
        setAddresses([]);
        setAddressError("No addresses found.");
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      setAddressError("Failed to load addresses.");
    }
  };

  // Handle errors
  const handleError = (error) => {
    console.error("Error occurred:", error);

    if (error.response) {
      if (error.response.status === 401) {
        navigate("/home");
      } else {
        setError(
          error.response.data?.message ||
            "An unexpected error occurred on the server."
        );
      }
    } else if (error.request) {
      setError("No response from server. Please try again later.");
    } else {
      setError("An unexpected error occurred. Please try again later.");
    }
  };

  // Fetch user's meals
  const fetchUserMeals = async () => {
    try {
      const response = await fetchWithAuth("get", "/api/meals/user");
      setUserMeals(response.data.data);
    } catch (error) {
      console.error("Error fetching user's meals:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchUserMeals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle profile picture upload
  const handleProfilePictureUpload = (profilePictureUrl) => {
    setProfile({ ...profile, profile_picture: profilePictureUrl });
  };

  // Add or update an address
  const addOrUpdateAddress = async (address) => {
    try {
      if (editingAddress) {
        await fetchWithAuth(
          "put",
          `/api/address/update/${editingAddress._id}`,
          address
        );
      } else {
        await fetchWithAuth("post", "/api/address/add", address);
      }

      // Fetch updated addresses
      await fetchAddresses();

      setEditingAddress(null);
      setShowAddressForm(false);
    } catch (error) {
      console.error("Error adding/updating address:", error);
      handleError(error);
    }
  };

  // Set active address
  const setActiveAddress = async (addressId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("No token found, navigating to login.");
        navigate("/login");
        return;
      }

      await api.post(
        "/api/address/set-active",
        { addressId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Fetch updated profile to reflect the new active address
      await fetchProfile();
    } catch (error) {
      console.error("Error setting active address:", error);
      handleError(error);
    }
  };

  // Delete an address
  const deleteAddress = async (addressId) => {
    try {
      await fetchWithAuth("delete", `/api/address/delete/${addressId}`);

      // Fetch updated addresses
      await fetchAddresses();
    } catch (error) {
      console.error("Error deleting address:", error);
      handleError(error);
    }
  };

  // Modify an address
  const modifyAddress = (addressId) => {
    const addressToEdit = addresses.find(
      (address) => address._id === addressId
    );

    setEditingAddress(addressToEdit);
    setShowAddressForm(true);
  };

  // Delete a meal
  const deleteMeal = async (mealId) => {
    if (window.confirm("Are you sure you want to delete this meal?")) {
      try {
        await api.delete(`/api/meals/${mealId}`);
        alert("Meal deleted successfully.");
        await fetchUserMeals();
      } catch (error) {
        console.error("Error deleting meal:", error);
        alert("Failed to delete meal.");
      }
    }
  };

  // Handler for "Become a Chef"
  const handleBecomeChef = async (e) => {
    e.preventDefault();

    // Form Validation
    if (!chefSpecialty.trim()) {
      setSpecialtyError("Specialty is required.");
      return;
    }

    if (chefSpecialty.trim().length < 3) {
      setSpecialtyError("Specialty must be at least 3 characters long.");
      return;
    }

    setIsBecomingChef(true);
    setBecomeChefError(null);
    setBecomeChefSuccess(null);
    setSpecialtyError(null);

    try {
      await fetchWithAuth("post", "/api/auth/become-chef", {
        specialty: chefSpecialty.trim(),
      });

      // Fetch the updated profile
      await fetchProfile();

      setBecomeChefSuccess("You have successfully become a chef!");
      setShowChefModal(false);
    } catch (error) {
      console.error("Error becoming a chef:", error);
      setBecomeChefError(
        error.response?.data?.msg ||
          "Failed to become a chef. Please try again later."
      );
    } finally {
      setIsBecomingChef(false);
      setChefSpecialty("");
    }
  };

  // Loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Error state
  if (error) {
    console.error("Rendering error:", error);
    return <div className="error">{error}</div>;
  }

  // No profile found
  if (!profile) {
    console.warn("Profile not found.");
    return <div>Profile data could not be loaded.</div>;
  }

  const profilePictureUrl = profile?.profile_picture?.startsWith("/")
    ? `${window.location.protocol}//${window.location.hostname}:5080${profile.profile_picture}`
    : profile?.profile_picture || "/uploads/default-pp.png";

  return (
    <div className="container">
      <h1 className="header">Profile</h1>
      <div className="profile-section">
        <img
          className="profile-pic"
          src={imageError ? "/uploads/default-pp.png" : profilePictureUrl}
          alt="Profile"
          onError={() => setImageError(true)}
        />
        <ProfilePictureUpload onUpload={handleProfilePictureUpload} />
      </div>
      <div className="profile-details">
        <p className="info">Full Name: {profile.full_name}</p>
        <p className="info">Username: {profile.username}</p>
        <p className="info">Email: {profile.email}</p>
        <p className="info">Phone: {profile.phone_number}</p>

        {/* "Become a Chef" Button and Feedback Messages */}
        {!profile.isChef && (
          <div className="become-chef-section">
            <button
              className="button become-chef-button"
              onClick={() => setShowChefModal(true)}
              disabled={isBecomingChef}
            >
              {isBecomingChef ? "Becoming Chef..." : "Become a Chef"}
            </button>
            {becomeChefError && <p className="error">{becomeChefError}</p>}
            {becomeChefSuccess && (
              <p className="success">{becomeChefSuccess}</p>
            )}
          </div>
        )}

        {/* Chef-Specific UI */}
        {profile.isChef && (
          <div className="chef-section">
            <h2>Your Chef Profile</h2>
            <p className="info">Specialty: {profile.chefSpecialty}</p>
            {/* Add more chef-specific information or options here */}
          </div>
        )}

        {/* Chef Specialty Modal */}
        {showChefModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Become a Chef</h2>
              <form onSubmit={handleBecomeChef}>
                <label htmlFor="specialty">Specialty:</label>
                <input
                  type="text"
                  id="specialty"
                  value={chefSpecialty}
                  onChange={(e) => setChefSpecialty(e.target.value)}
                  required
                  placeholder="Enter your culinary specialty"
                />
                {specialtyError && <p className="error">{specialtyError}</p>}
                <div className="modal-actions">
                  <button
                    type="submit"
                    className="button"
                    disabled={isBecomingChef}
                  >
                    {isBecomingChef ? "Submitting..." : "Submit"}
                  </button>
                  <button
                    type="button"
                    className="button button-secondary"
                    onClick={() => setShowChefModal(false)}
                    disabled={isBecomingChef}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <h2>Current Address</h2>
        <p className="meal-location">
          {profile.activeAddress
            ? `${profile.activeAddress.street}, ${profile.activeAddress.city}, ${profile.activeAddress.state}, ${profile.activeAddress.postalCode}, ${profile.activeAddress.country}`
            : "N/A"}
        </p>

        <div className="addresses-section">
          <h2>All Addresses</h2>
          {addressError && <p className="error">{addressError}</p>}
          <ul className="address-list">
            {Array.isArray(addresses) && addresses.length > 0 ? (
              addresses.map((address) => {
                const isActive =
                  profile.activeAddress &&
                  address._id === profile.activeAddress._id;

                return (
                  <li key={address._id} className="address-item">
                    <span className="address-info">
                      {address.formattedAddress ||
                        `${address.street}, ${address.city}, ${address.state}, ${address.postalCode}, ${address.country}`}
                    </span>
                    <div className="address-actions">
                      <button
                        onClick={() => modifyAddress(address._id)}
                        className="edit-address-button"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteAddress(address._id)}
                        className="delete-address-button"
                      >
                        Delete
                      </button>
                      {isActive ? (
                        <span className="active-label">Active</span>
                      ) : (
                        <button
                          onClick={() => setActiveAddress(address._id)}
                          className="set-active-button"
                        >
                          Set as Active
                        </button>
                      )}
                    </div>
                  </li>
                );
              })
            ) : (
              <p>No addresses found.</p>
            )}
          </ul>
        </div>

        <button
          className="button toggle-address-form-button"
          onClick={() => {
            setEditingAddress(null);
            setShowAddressForm(!showAddressForm);
          }}
        >
          {showAddressForm ? "Hide Address Form" : "Add New Address"}
        </button>

        {showAddressForm && (
          <div className="form-container">
            <AddressForm
              addAddress={addOrUpdateAddress}
              editingAddress={editingAddress}
            />
          </div>
        )}
      </div>

      <h2>Your Meals</h2>
      <div className="meals-grid">
        {userMeals.length > 0 ? (
          userMeals.map((meal) => (
            <MealCard
              key={meal._id}
              meal={meal}
              showEditButton={true}
              showDeleteButton={true}
              onEdit={() => navigate(`/edit-meal/${meal._id}`)}
              onDelete={() => deleteMeal(meal._id)}
            />
          ))
        ) : (
          <p>No meals available.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
