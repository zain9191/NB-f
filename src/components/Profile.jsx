import React, { useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import AddressForm from "./AddressForm";
import ProfilePictureUpload from "./ProfilePictureUpload"; // Ensure this import is correct
import api from "../utils/api";
import styled from "styled-components";
import axios from "axios";

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Header = styled.h1`
  color: #333;
  text-align: center;
  margin-bottom: 20px;
`;

const Info = styled.p`
  font-size: 16px;
  color: #666;
  margin: 5px 0;
`;

const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

const ProfileDetails = styled.div`
  margin-top: 20px;
`;

const ProfilPic = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #ccc;
  margin-bottom: 20px;
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  margin: 5px;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const FormContainer = styled.div`
  margin-top: 20px;
`;

const SpecialtyInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Dropdown = styled.select`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(user || null);
  const [loading, setLoading] = useState(!user);
  const [addresses, setAddresses] = useState([]);
  const [specialty, setSpecialty] = useState("");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showAddressDropdown, setShowAddressDropdown] = useState(false);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found, redirecting to login.");
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProfile(response.data);
        setAddresses(response.data.addresses || []);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.error("Unauthorized, redirecting to login.");
          navigate("/login");
        } else {
          console.error("Error fetching profile:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    if (!user) {
      fetchProfile();
    }
  }, [navigate, user]);

  const handleProfilePictureUpload = (profilePictureUrl) => {
    setProfile((prevProfile) => ({
      ...prevProfile,
      profilePicture: profilePictureUrl,
    }));
  };

  const addAddress = async (address) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.post("/api/address/add", address, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProfile((prevProfile) => ({
        ...prevProfile,
        addresses: response.data.data.addresses,
        activeAddress: response.data.data.activeAddress,
      }));
      setAddresses(response.data.data.addresses);
      setShowAddressForm(false);
      setShowAddressDropdown(true);
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

      // Assuming the API response returns the updated profile data
      const updatedProfile = response.data.data;

      setProfile((prevProfile) => ({
        ...prevProfile,
        activeAddress: updatedProfile.activeAddress,
        addresses: updatedProfile.addresses,
      }));
    } catch (error) {
      console.error("Error setting active address:", error);
    }
  };

  const becomeChef = async () => {
    try {
      const token = localStorage.getItem("token");
      await api.post(
        "/api/users/become-chef",
        { specialty },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("You are now a chef!");
      setProfile((prevProfile) => ({
        ...prevProfile,
        isChef: true,
      }));
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

  const profilePictureUrl =
    profile.profilePicture && profile.profilePicture.startsWith("/")
      ? `${window.location.protocol}//${window.location.hostname}:5080${profile.profilePicture}`
      : profile.profilePicture || "/uploads/default-pp.png";

  const handleAddressChange = (e) => {
    const value = e.target.value;
    if (value === "add-new-address") {
      setShowAddressForm(true);
      setShowAddressDropdown(false);
    } else {
      setActiveAddress(value);
      setShowAddressForm(false);
      setShowAddressDropdown(false);
    }
  };

  return (
    <Container>
      <Header>{profile.name}'s Profile</Header>
      <ProfileSection>
        <ProfilPic
          src={imageError ? "/uploads/default-pp.png" : profilePictureUrl}
          alt="Profile"
          onError={() => setImageError(true)}
        />
        <ProfilePictureUpload onUpload={handleProfilePictureUpload} />
      </ProfileSection>
      <ProfileDetails>
        <Info>Email: {profile.email}</Info>
        <Info>Phone: {profile.phone}</Info>
        <Info>ZipCode: {profile.zipCode}</Info>

        <h2>Current Address</h2>
        {profile.activeAddress ? (
          <div>
            {profile.activeAddress.addressLine}, {profile.activeAddress.city},{" "}
            {profile.activeAddress.state}, {profile.activeAddress.zipCode},{" "}
            {profile.activeAddress.country}
          </div>
        ) : (
          <p>No active address selected</p>
        )}
        <Button onClick={() => setShowAddressDropdown(!showAddressDropdown)}>
          Change Current Address
        </Button>

        {showAddressDropdown && addresses.length > 0 && (
          <>
            <Dropdown
              onChange={handleAddressChange}
              value={profile.activeAddress ? profile.activeAddress._id : ""}
            >
              <option value="" disabled>
                Select an address
              </option>
              {addresses.map((address) => (
                <option key={address._id} value={address._id}>
                  {address.addressLine}, {address.city}
                </option>
              ))}
              <option value="add-new-address">Add New Address</option>
            </Dropdown>
          </>
        )}

        {showAddressForm && (
          <FormContainer>
            <AddressForm addAddress={addAddress} />
          </FormContainer>
        )}

        {!profile.isChef && (
          <FormContainer>
            <h2>Become a Chef</h2>
            <SpecialtyInput
              type="text"
              placeholder="Specialty"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              required
            />
            <Button onClick={becomeChef}>Become a Chef</Button>
          </FormContainer>
        )}

        {profile.isChef && (
          <div>
            <Link to="/create-meal">
              <Button>Add Meal</Button>
            </Link>
          </div>
        )}
      </ProfileDetails>
    </Container>
  );
};

export default Profile;
