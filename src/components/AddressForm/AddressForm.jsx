import React from "react";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import MapSelector from "../MapSelector/MapSelector";

const AddressForm = ({ addAddress, loading, error }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();

  const onLocationSelect = async (latlng) => {
    setValue("latitude", latlng.lat);
    setValue("longitude", latlng.lng);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latlng.lat}&lon=${latlng.lng}`
      );
      const data = await response.json();

      setValue("street", data.address.road || "");
      setValue("city", data.address.city || data.address.town || "");
      setValue("state", data.address.state || "");
      setValue("postalCode", data.address.postcode || "");
      setValue("country", data.address.country || "");
      setValue("formattedAddress", data.display_name || "");
    } catch (geoError) {
      console.error("Error fetching address details:", geoError);
    }
  };

  const onSubmit = async (data) => {
    try {
      await addAddress(data);
      reset();
    } catch (submissionError) {
      console.error("Error submitting the form:", submissionError);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="address-form">
      <div className="form-group">
        <input
          type="text"
          placeholder="Street"
          {...register("street", { required: "Street is required." })}
        />
        {errors.street && <p className="error">{errors.street.message}</p>}
      </div>
      {/* Repeat for other fields */}
      <div className="form-group">
        <input
          type="text"
          placeholder="City"
          {...register("city", { required: "City is required." })}
        />
        {errors.city && <p className="error">{errors.city.message}</p>}
      </div>
      {/* ... */}
      <MapSelector onLocationSelect={onLocationSelect} />
      {/* Hidden inputs to store latitude and longitude */}
      <input type="hidden" {...register("latitude", { required: true })} />
      <input type="hidden" {...register("longitude", { required: true })} />
      {errors.latitude && <p className="error">Location is required.</p>}
      <button
        type="submit"
        disabled={loading || isSubmitting}
        className="button add-address-submit-button"
      >
        {loading || isSubmitting ? "Adding..." : "Add Address"}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
};

AddressForm.propTypes = {
  addAddress: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
};

AddressForm.defaultProps = {
  loading: false,
  error: null,
};

export default AddressForm;
