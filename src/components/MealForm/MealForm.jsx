// File: src/components/MealForm/MealForm.jsx

import React, { useState, useContext } from "react";
import api from "../../utils/api"; // Import the centralized Axios instance
import { AuthContext } from "../../contexts/AuthContext";
import AddressSelector from "../AddressSelector/AddressSelector"; // Adjust the path as necessary

// Optionally import CSS if available
// import "./MealForm.css";

/**
 * Utility function to split comma-separated strings into trimmed arrays.
 * @param {string} str - The comma-separated string.
 * @returns {Array} - The trimmed array.
 */
const splitAndTrim = (str) =>
  str
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item);

/**
 * MealForm Component
 * Allows users to create a new meal with comprehensive details.
 */
const MealForm = () => {
  const { user } = useContext(AuthContext);

  const initialMealData = {
    name: "",
    description: "",
    price: "",
    ingredients: "",
    category: "",
    cuisine: "",
    portionSize: "",
    nutritionalInfo: {
      calories: "",
      protein: "",
      fat: "",
      carbs: "",
      vitamins: "",
    },
    dietaryRestrictions: "",
    expirationDate: "",
    pickupDeliveryOptions: "",
    preparationDate: "",
    packagingInformation: "",
    healthSafetyCompliance: "",
    contactInformation: {
      email: "",
      phone: "",
    },
    paymentOptions: "",
    preparationMethod: "",
    cookingInstructions: "",
    additionalNotes: "",
    tags: "",
    sellerRating: "",
    quantityAvailable: "",
    discountsPromotions: "",
    images: [],
    addressId: "", // Added addressId
  };

  const [mealData, setMealData] = useState(initialMealData);

  /**
   * Handles changes for both top-level and nested fields in the form.
   * @param {Object} e - The event object.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMealData((prevData) => {
      const keys = name.split(".");
      const lastKey = keys.pop();
      const updatedData = { ...prevData };

      let temp = updatedData;
      keys.forEach((key) => {
        if (!temp[key]) temp[key] = {};
        temp = temp[key];
      });
      temp[lastKey] = value;
      return updatedData;
    });
  };

  /**
   * Handles image file selection.
   * @param {Object} e - The event object.
   */
  const handleImageChange = (e) => {
    setMealData({ ...mealData, images: e.target.files });
  };

  /**
   * Prepares meal data for submission.
   * @param {Object} data - The original meal data.
   * @returns {Object} - The prepared meal data.
   */
  const prepareMealData = (data) => {
    const { nutritionalInfo, contactInformation, ...rest } = data;

    return {
      ...rest,
      ingredients: splitAndTrim(data.ingredients),
      tags: splitAndTrim(data.tags),
      dietaryRestrictions: splitAndTrim(data.dietaryRestrictions),
      paymentOptions: splitAndTrim(data.paymentOptions),
      nutritionalInfo: {
        ...nutritionalInfo,
        vitamins: splitAndTrim(nutritionalInfo.vitamins || ""),
      },
      contactInformation: { ...contactInformation },
      // Removed the location object in favor of addressId
    };
  };

  /**
   * Handles form submission to create a new meal.
   * @param {Object} e - The event object.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate that an address has been selected
    if (!mealData.addressId) {
      alert("Please select a valid address using the address selector.");
      return;
    }

    // Prepare meal data to send
    const mealDataToSend = prepareMealData(mealData);

    // Initialize FormData
    const formData = new FormData();

    // Append simple fields
    for (let key in mealDataToSend) {
      if (key === "images" && mealData.images instanceof FileList) {
        for (let i = 0; i < mealData.images.length; i++) {
          formData.append("images", mealData.images[i]);
        }
      } else if (key === "nutritionalInfo" || key === "contactInformation") {
        formData.append(key, JSON.stringify(mealDataToSend[key]));
      } else {
        formData.append(key, mealDataToSend[key]);
      }
    }

    try {
      const response = await api.post("/api/meals", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        alert("Meal created successfully");
        // Optionally, reset the form or redirect the user
        setMealData(initialMealData);
      } else {
        alert(response.data.msg || "Failed to create meal.");
      }
    } catch (error) {
      console.error(
        "Error creating meal",
        error.response?.data || error.message
      );
      alert(
        "Error creating meal: " + (error.response?.data?.msg || error.message)
      );
    }
  };

  if (!user) {
    return <p>Please log in to create a meal.</p>;
  }

  /**
   * Handler to receive the selected addressId from AddressSelector
   * @param {string} selectedAddressId - The selected address's _id
   */
  const handleAddressSelect = (selectedAddressId) => {
    setMealData((prevData) => ({
      ...prevData,
      addressId: selectedAddressId,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="meal-form">
      <h2>Create a Meal</h2>

      {/* Meal Details */}
      <input
        type="text"
        name="name"
        placeholder="Meal Name"
        value={mealData.name}
        onChange={handleChange}
        required
      />
      <textarea
        name="description"
        placeholder="Description"
        value={mealData.description}
        onChange={handleChange}
        required
      ></textarea>
      <input
        type="number"
        name="price"
        placeholder="Price"
        value={mealData.price}
        onChange={handleChange}
        required
        min="0"
        step="0.01"
      />
      <input
        type="text"
        name="ingredients"
        placeholder="Ingredients (comma-separated)"
        value={mealData.ingredients}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="category"
        placeholder="Category"
        value={mealData.category}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="cuisine"
        placeholder="Cuisine"
        value={mealData.cuisine}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="portionSize"
        placeholder="Portion Size"
        value={mealData.portionSize}
        onChange={handleChange}
        required
      />

      {/* Nutritional Information */}
      <h3>Nutritional Information</h3>
      <input
        type="number"
        name="nutritionalInfo.calories"
        placeholder="Calories"
        value={mealData.nutritionalInfo.calories}
        onChange={handleChange}
        required
        min="0"
      />
      <input
        type="number"
        name="nutritionalInfo.protein"
        placeholder="Protein (g)"
        value={mealData.nutritionalInfo.protein}
        onChange={handleChange}
        required
        min="0"
        step="0.1"
      />
      <input
        type="number"
        name="nutritionalInfo.fat"
        placeholder="Fat (g)"
        value={mealData.nutritionalInfo.fat}
        onChange={handleChange}
        required
        min="0"
        step="0.1"
      />
      <input
        type="number"
        name="nutritionalInfo.carbs"
        placeholder="Carbs (g)"
        value={mealData.nutritionalInfo.carbs}
        onChange={handleChange}
        required
        min="0"
        step="0.1"
      />
      <input
        type="text"
        name="nutritionalInfo.vitamins"
        placeholder="Vitamins (comma-separated)"
        value={mealData.nutritionalInfo.vitamins}
        onChange={handleChange}
      />

      {/* Dietary Restrictions */}
      <input
        type="text"
        name="dietaryRestrictions"
        placeholder="Dietary Restrictions (comma-separated)"
        value={mealData.dietaryRestrictions}
        onChange={handleChange}
      />

      {/* Dates */}
      <input
        type="date"
        name="expirationDate"
        placeholder="Expiration Date"
        value={mealData.expirationDate}
        onChange={handleChange}
        required
      />
      <input
        type="date"
        name="preparationDate"
        placeholder="Preparation Date"
        value={mealData.preparationDate}
        onChange={handleChange}
        required
      />

      {/* Pickup/Delivery Options */}
      <input
        type="text"
        name="pickupDeliveryOptions"
        placeholder="Pickup/Delivery Options"
        value={mealData.pickupDeliveryOptions}
        onChange={handleChange}
        required
      />

      {/* Address Selection using AddressSelector */}
      <h3>Address</h3>
      <AddressSelector onAddressSelect={handleAddressSelect} />
      {/* Display selected address details for confirmation */}
      {mealData.addressId && (
        <p>
          <strong>Selected Address ID:</strong> {mealData.addressId}
        </p>
      )}

      {/* Packaging and Compliance */}
      <input
        type="text"
        name="packagingInformation"
        placeholder="Packaging Information"
        value={mealData.packagingInformation}
        onChange={handleChange}
      />
      <input
        type="text"
        name="healthSafetyCompliance"
        placeholder="Health & Safety Compliance"
        value={mealData.healthSafetyCompliance}
        onChange={handleChange}
      />

      {/* Contact Information */}
      <h3>Contact Information</h3>
      <input
        type="email"
        name="contactInformation.email"
        placeholder="Contact Email"
        value={mealData.contactInformation.email}
        onChange={handleChange}
        required
      />
      <input
        type="tel"
        name="contactInformation.phone"
        placeholder="Contact Phone"
        value={mealData.contactInformation.phone}
        onChange={handleChange}
        required
        pattern="^[0-9]{10,15}$" // Adjust pattern as needed
        title="Please enter a valid phone number."
      />

      {/* Payment and Additional Details */}
      <input
        type="text"
        name="paymentOptions"
        placeholder="Payment Options (comma-separated)"
        value={mealData.paymentOptions}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="preparationMethod"
        placeholder="Preparation Method"
        value={mealData.preparationMethod}
        onChange={handleChange}
      />
      <input
        type="text"
        name="cookingInstructions"
        placeholder="Cooking Instructions"
        value={mealData.cookingInstructions}
        onChange={handleChange}
      />
      <input
        type="text"
        name="additionalNotes"
        placeholder="Additional Notes"
        value={mealData.additionalNotes}
        onChange={handleChange}
      />
      <input
        type="text"
        name="tags"
        placeholder="Tags (comma-separated)"
        value={mealData.tags}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="sellerRating"
        placeholder="Seller Rating (1-5)"
        value={mealData.sellerRating}
        onChange={handleChange}
        min="1"
        max="5"
      />
      <input
        type="number"
        name="quantityAvailable"
        placeholder="Quantity Available"
        value={mealData.quantityAvailable}
        onChange={handleChange}
        required
        min="1"
      />
      <input
        type="text"
        name="discountsPromotions"
        placeholder="Discounts/Promotions"
        value={mealData.discountsPromotions}
        onChange={handleChange}
      />

      {/* Image Upload */}
      <input
        type="file"
        name="images"
        multiple
        onChange={handleImageChange}
        accept="image/*"
      />

      {/* Submit Button */}
      <button type="submit">Create Meal</button>
    </form>
  );
};

export default MealForm;
