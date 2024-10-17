// src/components/Profile/Profile.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileDetails from "../ProfileDetails/ProfileDetails";
import AddressList from "../AddressList/AddressList";
import ChefSection from "../ChefSection/ChefSection";
import MealList from "../MealList/MealList";
import BecomeChefModal from "../BecomeChefModal/BecomeChefModal";
import AddressForm from "../AddressForm/AddressForm";
import api from "../../utils/api";
import { useError } from "../../contexts/ErrorContext";

import "./Profile.css";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [userMeals, setUserMeals] = useState([]);

  const [isBecomingChef, setIsBecomingChef] = useState(false);
  const [becomeChefSuccess, setBecomeChefSuccess] = useState(null);
  const [showChefModal, setShowChefModal] = useState(false);

  const navigate = useNavigate();

  const { handleError, handleSuccess } = useError();

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
        handleError(new Error("Unauthorized access. Redirecting to home."));
        navigate("/home");
      } else {
        handleError(error);
      }
      throw error;
    }
  };

  // Updated fetchProfile function with new endpoint
  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await fetchWithAuth("get", "/api/auth");
      setProfile(response.user || response.data.user || response);
      await fetchAddresses();
    } catch (error) {
      handleError(new Error("Failed to load profile."));
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAddresses = async () => {
    try {
      const response = await fetchWithAuth("get", "/api/address");
      if (response.success) {
        // Changed from response.data.success
        setAddresses(response.data); // Changed from response.data.data
      } else {
        setAddresses([]);
        handleError(new Error("No addresses found."));
      }
    } catch (error) {
      handleError(new Error("Failed to load addresses."));
      console.error("Error fetching addresses:", error);
    }
  };

  const fetchUserMeals = async () => {
    try {
      const response = await fetchWithAuth("get", "/api/meals/user");
      // console.log("response: ", response);
      setUserMeals(response.data);
    } catch (error) {
      console.error("Error fetching user's meals:", error);
      handleError(new Error("Failed to load your meals."));
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchUserMeals();
  }, []);

  const handleProfilePictureUpload = (profilePictureUrl) => {
    setProfile((prevProfile) => ({
      ...prevProfile,
      profilePicture: profilePictureUrl,
    }));
  };

  const addOrUpdateAddress = async (address) => {
    try {
      if (editingAddress) {
        await fetchWithAuth(
          "put",
          `/api/address/${editingAddress._id}`,
          address
        );
        handleSuccess("Address updated successfully.");
      } else {
        await fetchWithAuth("post", "/api/address/", address);
        handleSuccess("Address added successfully.");
      }
      await fetchAddresses();
      setEditingAddress(null);
      setShowAddressForm(false);
    } catch (error) {
      console.error("Error adding/updating address:", error);
      handleError(new Error("Failed to add/update address."));
    }
  };

  const setActiveAddress = async (addressId) => {
    try {
      await fetchWithAuth("patch", `/api/address/${addressId}/active`);
      await fetchProfile();
      handleSuccess("Active address updated.");
    } catch (error) {
      console.error("Error setting active address:", error);
      handleError(new Error("Failed to set active address."));
    }
  };

  const deleteAddress = async (addressId) => {
    try {
      await fetchWithAuth("delete", `/api/address/${addressId}`);
      handleSuccess("Address deleted successfully.");
      await fetchAddresses();
    } catch (error) {
      console.error("Error deleting address:", error);
      handleError(new Error("Failed to delete address."));
    }
  };

  const modifyAddress = (addressId) => {
    const addressToEdit = addresses.find(
      (address) => address._id === addressId
    );
    setEditingAddress(addressToEdit);
    setShowAddressForm(true);
  };

  const deleteMeal = async (mealId) => {
    if (window.confirm("Are you sure you want to delete this meal?")) {
      try {
        await api.delete(`/api/meals/${mealId}`);
        handleSuccess("Meal deleted successfully."); // Using handleSuccess
        await fetchUserMeals();
      } catch (error) {
        console.error("Error deleting meal:", error);
        handleError(new Error("Failed to delete meal."));
      }
    }
  };

  const handleBecomeChef = () => {
    setShowChefModal(true);
  };

  const submitBecomeChef = async (specialty) => {
    setIsBecomingChef(true);
    setBecomeChefSuccess(null);

    try {
      await fetchWithAuth("post", "/api/auth/become-chef", { specialty });
      await fetchProfile();
      handleSuccess("You have successfully become a chef!"); // Using handleSuccess
      setShowChefModal(false);
    } catch (error) {
      console.error("Error becoming a chef:", error);
      handleError(new Error("Failed to become a chef."));
    } finally {
      setIsBecomingChef(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    console.warn("Profile not found.");
    return <div>Profile data could not be loaded.</div>;
  }

  return (
    <div className="container">
      <h1 className="header">Profile</h1>
      <ProfileDetails
        profile={profile.data ? profile.data : profile}
        onUpload={handleProfilePictureUpload}
      />

      <ChefSection
        profile={profile.data ? profile.data : profile}
        onBecomeChef={handleBecomeChef}
        isBecomingChef={isBecomingChef}
      />

      <h2>Current Address</h2>
      <p className="meal-location">
        {profile.data && profile.data.activeAddress
          ? `${profile.data.activeAddress.street}, ${profile.data.activeAddress.city}, ${profile.data.activeAddress.state}, ${profile.data.activeAddress.postalCode}, ${profile.data.activeAddress.country}`
          : "N/A"}
      </p>

      <AddressList
        addresses={addresses}
        activeAddressId={
          profile.data && profile.data.activeAddress
            ? profile.data.activeAddress._id
            : null
        }
        onEdit={modifyAddress}
        onDelete={deleteAddress}
        onSetActive={setActiveAddress}
      />

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

      <h2>Your Meals</h2>
      <MealList
        meals={userMeals}
        onEdit={(id) => navigate(`/meal-form/${id}`)}
        onDelete={deleteMeal}
      />

      <BecomeChefModal
        isOpen={showChefModal}
        onClose={() => setShowChefModal(false)}
        onSubmit={submitBecomeChef}
        isSubmitting={isBecomingChef}
      />
    </div>
  );
};

export default Profile;
