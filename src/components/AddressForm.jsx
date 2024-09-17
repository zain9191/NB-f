import React, { useState, useEffect } from "react";

const AddressForm = ({ addAddress, editingAddress }) => {
  const [formData, setFormData] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  useEffect(() => {
    if (editingAddress) {
      setFormData(editingAddress);
    }
  }, [editingAddress]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addAddress(formData);
    setFormData({
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{editingAddress ? "Edit Address" : "Add Address"}</h3>
      <input
        type="text"
        name="street"
        placeholder="Street"
        value={formData.street}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="city"
        placeholder="City"
        value={formData.city}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="state"
        placeholder="State"
        value={formData.state}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="postalCode"
        placeholder="Postal Code"
        value={formData.postalCode}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="country"
        placeholder="Country"
        value={formData.country}
        onChange={handleChange}
        required
      />
      <button type="submit">
        {editingAddress ? "Save Changes" : "Add Address"}
      </button>
    </form>
  );
};
export default AddressForm;
