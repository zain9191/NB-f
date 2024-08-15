import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddressForm from "../AddressForm";
import api from "../../utils/api";
import ProfilePictureUpload from "../ProfilePictureUpload";
import "./Profile.css";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [error, setError] = useState(null);
  const [editingAddress, setEditingAddress] = useState(null);

  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await api.get("/api/profile");
      console.log("Profile API response:", response.data);

      setProfile(response.data);
      setAddresses(response.data.addresses || []);

      if (!response.data.activeAddress && response.data.addresses.length > 0) {
        const firstAddress = response.data.addresses[0];
        await setActiveAddress(firstAddress._id);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate("/login");
      } else {
        console.error("Failed to fetch profile:", error);
        setError("Failed to fetch profile data.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [navigate]);

  const handleProfilePictureUpload = (profilePictureUrl) => {
    setProfile({ ...profile, profilePicture: profilePictureUrl });
  };

  const addOrUpdateAddress = async (address) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found, please log in again.");

      let response;
      if (editingAddress) {
        response = await api.put(
          `/api/address/update/${editingAddress._id}`,
          address,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        response = await api.post("/api/address/add", address, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      const updatedAddresses = response.data.addresses || [];
      setAddresses(updatedAddresses);

      if (!profile.activeAddress && updatedAddresses.length > 0) {
        await setActiveAddress(updatedAddresses[0]._id);
      } else {
        setProfile((prevProfile) => ({
          ...prevProfile,
          addresses: updatedAddresses,
        }));
      }

      setEditingAddress(null);
      setShowAddressForm(false);

      // Refresh profile to ensure data consistency
      await fetchProfile();
    } catch (error) {
      setError(`Failed to save address: ${error.message}`);
    }
  };

  const setActiveAddress = async (addressId) => {
    try {
      const token = localStorage.getItem("token");
      await api.post(
        "/api/address/set-active",
        { addressId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchProfile();
    } catch (error) {
      console.error("Error setting active address:", error);
      setError("Failed to set active address.");
    }
  };

  const deleteAddress = async (addressId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.delete(`/api/address/delete/${addressId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedAddresses = response.data.addresses || [];
      setAddresses(updatedAddresses);

      if (profile.activeAddress && profile.activeAddress._id === addressId) {
        if (updatedAddresses.length > 0) {
          await setActiveAddress(updatedAddresses[0]._id);
        } else {
          setProfile((prevProfile) => ({
            ...prevProfile,
            activeAddress: null,
          }));
        }
      }

      // Refresh profile to ensure data consistency
      await fetchProfile();
    } catch (error) {
      setError("Failed to delete address. Please try again.");
    }
  };

  const modifyAddress = (addressId) => {
    const addressToEdit = addresses.find(
      (address) => address._id === addressId
    );
    setEditingAddress(addressToEdit);
    setShowAddressForm(true);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!profile) {
    return <div>Profile data could not be loaded.</div>;
  }

  const profilePictureUrl = profile.profilePicture.startsWith("/")
    ? `${window.location.protocol}//${window.location.hostname}:5080${profile.profilePicture}`
    : profile.profilePicture;

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
        <p className="info">Name: {profile.name}</p>
        <p className="info">Email: {profile.email}</p>
        <p className="info">Phone: {profile.phone}</p>
        <p className="info">ZipCode: {profile.zipCode}</p>

        <h2>Current Address</h2>
        {profile.activeAddress ? (
          <div>
            {profile.activeAddress.addressLine}, {profile.activeAddress.city},{" "}
            {profile.activeAddress.state}, {profile.activeAddress.zipCode},{" "}
            {profile.activeAddress.country}
          </div>
        ) : (
          <p>Add an address.</p>
        )}

        <h2>All Addresses</h2>
        <ul className="address-list">
          {addresses.map((address) => (
            <li key={address._id} className="address-item">
              <span>
                {address.addressLine}, {address.city}, {address.state},{" "}
                {address.zipCode}, {address.country}
              </span>

              <div className="address-actions">
                <button
                  className="button"
                  onClick={() => setActiveAddress(address._id)}
                  disabled={address._id === profile.activeAddress._id}
                >
                  {address._id === profile.activeAddress._id
                    ? "Current Address"
                    : "Set as Active"}
                </button>

                <button
                  className="button"
                  onClick={() => deleteAddress(address._id)}
                >
                  Delete
                </button>

                <button
                  className="button"
                  onClick={() => modifyAddress(address._id)}
                >
                  Modify
                </button>
              </div>
            </li>
          ))}
        </ul>

        <button
          className="button"
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
    </div>
  );
};

export default Profile;
