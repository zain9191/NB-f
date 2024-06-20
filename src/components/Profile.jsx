import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddressForm from "./AddressForm";
import api from "../utils/api";
import ProfilePictureUpload from "./ProfilePictureUpload";
import styled from "styled-components";

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

const AddressList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const AddressItem = styled.li`
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
  margin: 10px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AddressButtons = styled.div`
  display: flex;
  gap: 10px;
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
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState([]);
  const [specialty, setSpecialty] = useState("");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showAddressDropdown, setShowAddressDropdown] = useState(false);
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
        setProfile(response.data);
        setAddresses(response.data.addresses || []);
      } catch (error) {
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
      setShowAddressForm(false); // Hide form after adding address
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
    ? `${window.location.protocol}//${window.location.hostname}:5080${profile.profilePicture}`
    : profile.profilePicture;

  return (
    <Container>
      <Header>Profile</Header>
      <ProfileSection>
        <ProfilPic
          src={imageError ? "/uploads/default-pp.png" : profilePictureUrl}
          alt="Profile"
          onError={() => setImageError(true)}
        />
        <ProfilePictureUpload onUpload={handleProfilePictureUpload} />
      </ProfileSection>
      <ProfileDetails>
        <Info>Name: {profile.name}</Info>
        <Info>Email: {profile.email}</Info>
        <Info>Phone: {profile.phone}</Info>
        <Info>ZipCode: {profile.zipCode}</Info>

        <h2>Current Address</h2>
        {profile.activeAddress && (
          <div>
            {profile.activeAddress.addressLine}, {profile.activeAddress.city},{" "}
            {profile.activeAddress.state}, {profile.activeAddress.zipCode},{" "}
            {profile.activeAddress.country}
            <Button
              onClick={() => setShowAddressDropdown(!showAddressDropdown)}
            >
              Change Current Address
            </Button>
          </div>
        )}

        {showAddressDropdown && (
          <>
            <Dropdown
              onChange={(e) => setActiveAddress(e.target.value)}
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

            <AddressList>
              {addresses.map((address) => (
                <AddressItem key={address._id}>
                  <div>
                    {address.addressLine}, {address.city}, {address.state},{" "}
                    {address.zipCode}, {address.country}
                  </div>
                  <AddressButtons>
                    <Button onClick={() => setActiveAddress(address._id)}>
                      {profile.activeAddress &&
                      profile.activeAddress._id === address._id
                        ? "Active"
                        : "Set Active"}
                    </Button>
                    <Button onClick={() => deleteAddress(address._id)}>
                      Delete
                    </Button>
                  </AddressButtons>
                </AddressItem>
              ))}
            </AddressList>
          </>
        )}

        <Button onClick={() => setShowAddressForm(!showAddressForm)}>
          {showAddressForm ? "Hide Address Form" : "Add New Address"}
        </Button>

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
      </ProfileDetails>
    </Container>
  );
};

export default Profile;
