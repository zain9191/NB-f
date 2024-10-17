// src/components/AddressSelector/AddressSelector.jsx
import React, { useEffect, useState, useContext } from "react";
import api from "../../utils/api";
import { AuthContext } from "../../contexts/AuthContext";
import "./AddressSelector.css";

const AddressSelector = ({
  onAddressSelect,
  selectedAddressId,
  onAddAddress,
}) => {
  const { user } = useContext(AuthContext);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await api.get("/api/address");
        if (response.success) {
          setAddresses(response.data); // Correctly set to the addresses array
        } else {
          setError("Failed to fetch addresses.");
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
        setError("Error fetching addresses.");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchAddresses();
    }
  }, [user]);

  if (loading) {
    return <p>Loading addresses...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (!Array.isArray(addresses) || addresses.length === 0) {
    return (
      <div className="address-selector">
        <p>No saved addresses. Please add a new address.</p>
        {onAddAddress && (
          <button type="button" onClick={onAddAddress}>
            Add New Address
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="address-selector">
      <select
        value={selectedAddressId || ""}
        onChange={(e) => onAddressSelect(e.target.value)}
        required
      >
        <option value="" disabled>
          Select an Address
        </option>
        {addresses.map((address) => (
          <option key={address._id} value={address._id}>
            {`${address.street}, ${address.city}, ${address.state}, ${address.postalCode}, ${address.country}`}
          </option>
        ))}
      </select>
      {onAddAddress && (
        <button type="button" onClick={onAddAddress}>
          Add New Address
        </button>
      )}
    </div>
  );
};

export default AddressSelector;
