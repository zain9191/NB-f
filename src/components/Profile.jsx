// components/Profile.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddressForm from "./AddressForm";
import api from "../utils/api";
import ProfilePictureUpload from "./ProfilePictureUpload";
import styled from "styled-components";

const ProfilPic = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #ccc;
`;

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState([]);
  const [specialty, setSpecialty] = useState("");
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await api.get("/api/profile");
        console.log("Profile data fetched:", response.data);
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

  const handleProfilePictureUpload = (profilePictureUrl) => {
    setProfile({ ...profile, profilePicture: profilePictureUrl });
  };

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

  const becomeChef = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.post(
        "/api/users/become-chef",
        { specialty },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("You are now a chef!");
      setProfile({ ...profile, isChef: true });
    } catch (error) {
      console.error("Error becoming chef:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return <div>Profile data could not be loaded.</div>;
  }

  const profilePictureUrl = profile.profilePicture.startsWith("/")
    ? `${window.location.origin}${profile.profilePicture}`
    : profile.profilePicture;

  console.log("Profile Picture URL:", profilePictureUrl); // Debug log

  return (
    <div>
      <h1>{profile.name}</h1>
      <p>Email: {profile.email}</p>
      <p>Phone: {profile.phone}</p>
      <p>ZipCode: {profile.zipCode}</p>
      <ProfilPic
        src={imageError ? "/uploads/default-pp.png" : profilePictureUrl}
        alt="Profile"
        onError={() => setImageError(true)}
      />
      <ProfilePictureUpload onUpload={handleProfilePictureUpload} />

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

      {!profile.isChef && (
        <div>
          <h2>Become a Chef</h2>
          <input
            type="text"
            placeholder="Specialty"
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            required
          />
          <button onClick={becomeChef}>Become a Chef</button>
        </div>
      )}
    </div>
  );
};

export default Profile;
