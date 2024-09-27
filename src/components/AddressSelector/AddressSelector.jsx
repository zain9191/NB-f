// src/components/AddressSelector/AddressSelector.jsx
import React, { useState, useEffect } from "react";
import api from "../../utils/api"; // Import the centralized Axios instance
import PropTypes from "prop-types";

const AddressSelector = ({ onAddressSelect }) => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    latitude: "",
    longitude: "",
    formattedAddress: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch existing addresses on component mount
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await api.get("/api/address"); // Use `api` instead of `axios`
        setAddresses(response.data.data); // Assuming the response structure
      } catch (err) {
        console.error("Error fetching addresses:", err);
        setError("Failed to fetch addresses.");
      }
    };

    fetchAddresses();
  }, []);

  // Handle selection of an existing address
  const handleSelectChange = (e) => {
    const addressId = e.target.value;
    setSelectedAddressId(addressId);
    const selectedAddress = addresses.find((addr) => addr._id === addressId);
    if (selectedAddress) {
      onAddressSelect(addressId);
    }
  };

  // Toggle the Add Address form
  const toggleAddAddressForm = () => {
    setShowAddAddressForm(!showAddAddressForm);
  };

  // Handle changes in the Add Address form
  const handleNewAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
  };

  // Handle submission of the Add Address form
  const handleAddAddress = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/api/address/add", newAddress); // Use `api` instead of `axios`
      const createdAddress = response.data;
      setAddresses((prev) => [...prev, createdAddress]);
      setSelectedAddressId(createdAddress._id);
      onAddressSelect(createdAddress._id);
      setNewAddress({
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
        latitude: "",
        longitude: "",
        formattedAddress: "",
      });
      setShowAddAddressForm(false);
    } catch (err) {
      console.error("Error adding new address:", err);
      setError("Failed to add new address.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="address-selector">
      <label htmlFor="address">Select Address:</label>
      <select
        id="address"
        value={selectedAddressId}
        onChange={handleSelectChange}
        required
      >
        <option value="" disabled>
          -- Select an Address --
        </option>
        {addresses.map((address) => (
          <option key={address._id} value={address._id}>
            {address.formattedAddress || `${address.street}, ${address.city}`}
          </option>
        ))}
      </select>

      <button type="button" onClick={toggleAddAddressForm}>
        {showAddAddressForm ? "Cancel" : "Add New Address"}
      </button>

      {showAddAddressForm && (
        <form onSubmit={handleAddAddress} className="add-address-form">
          <h3>Add New Address</h3>
          <input
            type="text"
            name="street"
            placeholder="Street"
            value={newAddress.street}
            onChange={handleNewAddressChange}
            required
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={newAddress.city}
            onChange={handleNewAddressChange}
            required
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            value={newAddress.state}
            onChange={handleNewAddressChange}
          />
          <input
            type="text"
            name="postalCode"
            placeholder="Postal Code"
            value={newAddress.postalCode}
            onChange={handleNewAddressChange}
            required
          />
          <input
            type="text"
            name="country"
            placeholder="Country"
            value={newAddress.country}
            onChange={handleNewAddressChange}
            required
          />
          <input
            type="number"
            name="latitude"
            placeholder="Latitude"
            value={newAddress.latitude}
            onChange={handleNewAddressChange}
            required
          />
          <input
            type="number"
            name="longitude"
            placeholder="Longitude"
            value={newAddress.longitude}
            onChange={handleNewAddressChange}
            required
          />
          <input
            type="text"
            name="formattedAddress"
            placeholder="Formatted Address"
            value={newAddress.formattedAddress}
            onChange={handleNewAddressChange}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Address"}
          </button>
          {error && <p className="error">{error}</p>}
        </form>
      )}
    </div>
  );
};

AddressSelector.propTypes = {
  onAddressSelect: PropTypes.func.isRequired,
};

export default AddressSelector;
