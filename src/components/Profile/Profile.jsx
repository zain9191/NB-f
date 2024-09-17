import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddressForm from "../AddressForm";
import api from "../../utils/api";
import ProfilePictureUpload from "../ProfilePictureUpload";
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

  const navigate = useNavigate();

  // Centralized fetch logic with token validation
  const fetchWithAuth = async (method, url, data = null, options = {}) => {
    // console.log(`Fetching with auth: ${method} ${url}`, options); // Debug
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No token found, navigating to login."); // Debug
      navigate("/login");
      return;
    }

    try {
      const response = await api({
        method,
        url,
        data,
        headers: { Authorization: `Bearer ${token}`, ...options.headers },
        ...options,
      });
      // console.log("Response received from fetchWithAuth:", response); // Debug
      return response;
    } catch (error) {
      console.error("Error in fetchWithAuth:", error); // Debug
      if (error.response && error.response.status === 401) {
        console.warn("Token invalid or expired, navigating to login."); // Debug
        navigate("/login");
      }
      throw error;
    }
  };

  // Fetch the user's profile
  const fetchProfile = async () => {
    // console.log("Fetching profile..."); // Debug
    setLoading(true);
    try {
      const response = await fetchWithAuth("get", "/api/auth");
      // console.log("Profile data received:", response.data); // Debug
      setProfile(response.data);

      // Fetch addresses after profile is loaded
      await fetchAddresses();
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
      // console.log("Profile fetching completed, loading state:", loading); // Debug
    }
  };

  // Fetch the user's addresses
  const fetchAddresses = async () => {
    // console.log("Fetching addresses for user"); // Debug
    try {
      const response = await fetchWithAuth("get", "/api/address");
      if (response && response.data) {
        // console.log("Addresses data received:", response.data); // Debug
        setAddresses(response.data);
      } else {
        // console.warn("No addresses found for user"); // Debug
        setAddresses([]);
        setAddressError("No addresses found.");
      }
    } catch (error) {
      // console.error("Error fetching addresses:", error); // Debug
      setAddressError("Failed to load addresses.");
    }
  };

  // Monitor addresses state update
  useEffect(() => {
    if (addresses.length > 0) {
      // console.log("Addresses state after setting:", addresses); // Debug
    }
  }, [addresses]);

  // Updated handleError function
  const handleError = (error) => {
    console.error("Error occurred:", error);

    if (error.response) {
      if (error.response.status === 401) {
        navigate("/login");
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

  useEffect(() => {
    // console.log("Component mounted, fetching profile..."); // Debug
    fetchProfile();
  }, []);

  // Handle profile picture upload
  const handleProfilePictureUpload = (profilePictureUrl) => {
    // console.log("Profile picture uploaded:", profilePictureUrl); // Debug
    setProfile({ ...profile, profile_picture: profilePictureUrl });
  };

  // Add or update an address
  const addOrUpdateAddress = async (address) => {
    // console.log("Attempting to add/update address:", address); // Debug
    try {
      if (editingAddress) {
        // console.log("Updating address:", editingAddress._id); // Debug
        await fetchWithAuth(
          "put",
          `/api/address/update/${editingAddress._id}`,
          address
        );
      } else {
        // console.log("Adding new address:", address); // Debug
        await fetchWithAuth("post", "/api/address/add", address);
      }

      // Fetch updated addresses
      await fetchAddresses();

      setEditingAddress(null);
      setShowAddressForm(false);
    } catch (error) {
      console.error("Error adding/updating address:", error); // Debug
      handleError(error);
    }
  };

  // Set active address
  const setActiveAddress = async (addressId) => {
    // console.log("Setting active address:", addressId);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("No token found, navigating to login.");
        navigate("/login");
        return;
      }

      const response = await api.post(
        "/api/address/set-active",
        { addressId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // console.log("Active address set successfully:", response.data);

      // Fetch updated profile to reflect the new active address
      await fetchProfile();
    } catch (error) {
      console.error("Error setting active address:", error);
      handleError(error);
    }
  };

  // Delete an address
  const deleteAddress = async (addressId) => {
    // console.log("Deleting address:", addressId); // Debug
    try {
      await fetchWithAuth("delete", `/api/address/delete/${addressId}`);

      // Fetch updated addresses
      await fetchAddresses();
    } catch (error) {
      console.error("Error deleting address:", error); // Debug
      handleError(error);
    }
  };

  // Modify an address
  const modifyAddress = (addressId) => {
    // console.log("Modifying address:", addressId); // Debug
    const addressToEdit = addresses.find(
      (address) => address._id === addressId
    );

    // console.log("Address to edit:", addressToEdit); // Debug
    setEditingAddress(addressToEdit);
    setShowAddressForm(true);
  };

  // Loading state
  if (loading) {
    // console.log("Loading..."); // Debug
    return <div>Loading...</div>;
  }

  // Error state
  if (error) {
    console.error("Rendering error:", error); // Debug
    return <div>{error}</div>;
  }

  // No profile found
  if (!profile) {
    // console.warn("Profile not found."); // Debug
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
          className="profil-pic"
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

        <h2>Current Address</h2>
        {profile.activeAddress ? (
          <div>
            {profile.activeAddress.street}, {profile.activeAddress.city},{" "}
            {profile.activeAddress.state}, {profile.activeAddress.postalCode},{" "}
            {profile.activeAddress.country}
          </div>
        ) : (
          <p>No active address set.</p>
        )}

        <div className="profile-details">
          <h2>All Addresses</h2>
          <ul className="address-list">
            {Array.isArray(addresses) && addresses.length > 0 ? (
              addresses.map((address) => {
                const isActive =
                  profile.activeAddress &&
                  address._id === profile.activeAddress._id;

                return (
                  <li key={address._id} className="address-item">
                    <span>
                      {address.street}, {address.city}, {address.state},{" "}
                      {address.postalCode}, {address.country}
                    </span>
                    <div className="address-actions">
                      <button onClick={() => modifyAddress(address._id)}>
                        Edit
                      </button>
                      <button onClick={() => deleteAddress(address._id)}>
                        Delete
                      </button>
                      {isActive ? (
                        <span>Active</span>
                      ) : (
                        <button onClick={() => setActiveAddress(address._id)}>
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
          className="button"
          onClick={() => {
            console.log("Toggling address form."); // Debug
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
    </div>
  );
};

export default Profile;
