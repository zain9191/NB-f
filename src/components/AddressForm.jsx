import React, { useState, useEffect } from "react";

const AddressForm = ({ addAddress, editingAddress }) => {
  const [formData, setFormData] = useState({
    addressLine: "",
    city: "",
    state: "",
    zipCode: "",
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
      addressLine: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{editingAddress ? "Edit Address" : "Add Address"}</h3>
      <input
        type="text"
        name="addressLine"
        placeholder="Address Line"
        value={formData.addressLine}
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
        name="zipCode"
        placeholder="Zip Code"
        value={formData.zipCode}
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
