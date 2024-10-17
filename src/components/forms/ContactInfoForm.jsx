import React from "react";
import { useFormContext } from "react-hook-form";

const ContactInfoForm = () => {
  const { register } = useFormContext();

  return (
    <fieldset>
      <legend>Contact Information</legend>
      <input
        type="email"
        {...register("contactInformation.email", { required: true })}
        placeholder="Contact Email"
      />
      <input
        type="tel"
        {...register("contactInformation.phone", {
          required: true,
          pattern: /^[0-9]{10,15}$/,
        })}
        placeholder="Contact Phone"
        title="Please enter a valid phone number."
      />
    </fieldset>
  );
};

export default ContactInfoForm;
