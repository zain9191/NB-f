// File: /Users/zainfrayha/Desktop/Code/mummys-food-front/src/components/Profile.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddressForm from "./AddressForm";
import api from "../utils/api"; // Ensure the path is correct

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await api.get("/api/profile");

        setProfile(response.data);
        setAddresses(response.data.addresses || []);
      } catch (error) {
        console.error("Error fetching profile:", error);
        if (error.response && error.response.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const addAddress = async (address) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.post("/api/address/add", address, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAddresses(response.data.addresses);
    } catch (error) {
      console.error("Error adding address:", error);
    }
  };

  const setActiveAddress = async (addressId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.post(
        "/api/address/set-active",
        { addressId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProfile(response.data);
    } catch (error) {
      console.error("Error setting active address:", error);
    }
  };

  const deleteAddress = async (addressId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.delete(`/api/address/delete/${addressId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAddresses(response.data.addresses);
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return <div>Profile data could not be loaded.</div>;
  }

  return (
    <div>
      <h1>{profile.name}</h1>
      <p>Email: {profile.email}</p>
      <p>Phone: {profile.phone}</p>
      <p>ZipCode: {profile.zipCode}</p>

      <h2>Addresses</h2>
      <ul>
        {addresses.map((address) => (
          <li key={address._id}>
            {address.addressLine}, {address.city}, {address.state},{" "}
            {address.zipCode}, {address.country}
            <button onClick={() => setActiveAddress(address._id)}>
              {profile.activeAddress &&
              profile.activeAddress._id === address._id
                ? "Active"
                : "Set Active"}
            </button>
            <button onClick={() => deleteAddress(address._id)}>Delete</button>
          </li>
        ))}
      </ul>
      <AddressForm addAddress={addAddress} />
    </div>
  );
};

export default Profile;
