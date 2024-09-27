// File: src/components/AddressForm/AddressForm.jsx
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";

const AddressForm = ({ addAddress, editingAddress }) => {
  const [formData, setFormData] = useState({
    address: "", // For autocomplete
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    location: {
      type: "Point",
      coordinates: [0, 0], // [longitude, latitude]
    },
  });

  useEffect(() => {
    if (editingAddress) {
      setFormData({
        address: `${editingAddress.street}, ${editingAddress.city}, ${editingAddress.state}`,
        street: editingAddress.street,
        city: editingAddress.city,
        state: editingAddress.state,
        postalCode: editingAddress.postalCode,
        country: editingAddress.country,
        location: editingAddress.location, // Ensure location is correctly set
      });
    }
  }, [editingAddress]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelect = async (value) => {
    try {
      const results = await geocodeByAddress(value);
      const latLng = await getLatLng(results[0]);

      // Extract address components
      const addressComponents = results[0].address_components;
      let street = "";
      let city = "";
      let state = "";
      let postalCode = "";
      let country = "";

      addressComponents.forEach((component) => {
        const types = component.types;
        if (types.includes("street_number")) {
          street = component.long_name + " ";
        }
        if (types.includes("route")) {
          street += component.long_name;
        }
        if (types.includes("locality") || types.includes("sublocality")) {
          city = component.long_name;
        }
        if (types.includes("administrative_area_level_1")) {
          state = component.short_name;
        }
        if (types.includes("postal_code")) {
          postalCode = component.long_name;
        }
        if (types.includes("country")) {
          country = component.long_name;
        }
      });

      setFormData({
        ...formData,
        address: value,
        street,
        city,
        state,
        postalCode,
        country,
        location: {
          type: "Point",
          coordinates: [latLng.lng, latLng.lat], // [longitude, latitude]
        },
      });
    } catch (error) {
      console.error("Error fetching address details:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Extract latitude and longitude
    const [longitude, latitude] = formData.location.coordinates;
    // Construct the address data as expected by the backend
    const addressData = {
      street: formData.street,
      city: formData.city,
      state: formData.state,
      postalCode: formData.postalCode,
      country: formData.country,
      formattedAddress: formData.address,
      latitude,
      longitude,
    };
    addAddress(addressData);
    // Reset form only if not editing
    if (!editingAddress) {
      setFormData({
        address: "",
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
        location: {
          type: "Point",
          coordinates: [0, 0],
        },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="address-form">
      <h3>{editingAddress ? "Edit Address" : "Add Address"}</h3>

      <PlacesAutocomplete
        value={formData.address}
        onChange={(address) => setFormData({ ...formData, address })}
        onSelect={handleSelect}
        debounce={500} // Optional: Debounce the input to limit API calls
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div className="autocomplete">
            <input
              {...getInputProps({
                placeholder: "Search Address...",
                className: "location-search-input",
              })}
              required
            />
            <div className="autocomplete-dropdown-container">
              {loading && <div className="loading">Loading...</div>}
              {suggestions.map((suggestion) => {
                const className = suggestion.active
                  ? "suggestion-item--active"
                  : "suggestion-item";
                const style = suggestion.active
                  ? {
                      backgroundColor: "#fafafa",
                      cursor: "pointer",
                    }
                  : {
                      backgroundColor: "#ffffff",
                      cursor: "pointer",
                    };
                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style,
                    })}
                    key={suggestion.placeId}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>

      <div className="form-group">
        <label htmlFor="street">Street</label>
        <input
          type="text"
          name="street"
          id="street"
          placeholder="Street"
          value={formData.street}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="city">City</label>
        <input
          type="text"
          name="city"
          id="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="state">State</label>
        <input
          type="text"
          name="state"
          id="state"
          placeholder="State"
          value={formData.state}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="postalCode">Postal Code</label>
        <input
          type="text"
          name="postalCode"
          id="postalCode"
          placeholder="Postal Code"
          value={formData.postalCode}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="country">Country</label>
        <input
          type="text"
          name="country"
          id="country"
          placeholder="Country"
          value={formData.country}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit" className="submit-button">
        {editingAddress ? "Save Changes" : "Add Address"}
      </button>
    </form>
  );
};

AddressForm.propTypes = {
  addAddress: PropTypes.func.isRequired,
  editingAddress: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    street: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
    postalCode: PropTypes.string.isRequired,
    country: PropTypes.string.isRequired,
    location: PropTypes.shape({
      type: PropTypes.string.isRequired,
      coordinates: PropTypes.arrayOf(PropTypes.number).isRequired,
    }).isRequired,
  }),
};

AddressForm.defaultProps = {
  editingAddress: null,
};

export default AddressForm;
