// src/components/EditMealForm.jsx

import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api"; // Import the centralized Axios instance
import { AuthContext } from "../contexts/AuthContext";

// Import the AddressSelector component
import AddressSelector from "../components/AddressSelector/AddressSelector"; // Adjust the path as necessary

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
 * Utility function to prepare meal data for submission.
 * @param {Object} mealData - The original meal data.
 * @returns {Object} - The processed meal data ready for FormData.
 */
const prepareMealData = (mealData) => {
  const {
    createdBy, // Exclude 'createdBy'
    ingredients,
    tags,
    dietaryRestrictions,
    paymentOptions,
    nutritionalInfo,
    contactInformation,
    // location is already handled via addressId
    addressId,
    ...rest
  } = mealData;

  return {
    ...rest,
    ingredients: splitAndTrim(ingredients),
    tags: splitAndTrim(tags),
    dietaryRestrictions: splitAndTrim(dietaryRestrictions),
    paymentOptions: splitAndTrim(paymentOptions),
    nutritionalInfo: {
      ...nutritionalInfo,
      vitamins: splitAndTrim(nutritionalInfo.vitamins),
    },
    contactInformation: { ...contactInformation },
    addressId, // Ensure addressId is included
  };
};

const EditMealForm = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams(); // Get the meal ID from URL parameters
  const navigate = useNavigate();
  const [mealData, setMealData] = useState(null); // Initialize mealData as null
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchMeal = async () => {
      try {
        const response = await api.get(`/api/meals/${id}`); // Use `api` instead of `axios`

        // Check if the logged-in user is the creator of the meal
        if (response.data.createdBy._id.toString() !== user._id.toString()) {
          alert("You are not authorized to edit this meal.");
          navigate("/profile");
          return;
        }

        const fetchedMeal = response.data;

        // Convert array fields to comma-separated strings
        const processedMeal = {
          ...fetchedMeal,
          ingredients: fetchedMeal.ingredients.join(", "),
          tags: fetchedMeal.tags.join(", "),
          dietaryRestrictions: fetchedMeal.dietaryRestrictions.join(", "),
          paymentOptions: fetchedMeal.paymentOptions.join(", "),
          nutritionalInfo: {
            ...fetchedMeal.nutritionalInfo,
            vitamins: fetchedMeal.nutritionalInfo.vitamins.join(", "),
          },
        };

        setMealData({
          ...processedMeal,
          addressId: fetchedMeal.address._id, // Use address _id
        });
        setSelectedAddressId(fetchedMeal.address._id);
      } catch (error) {
        console.error("Error fetching meal:", error);
        setError("Error fetching meal data.");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchMeal();
    }
  }, [id, user, navigate]);

  /**
   * Handles changes to input fields, including nested fields.
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
   * Handles changes to image inputs.
   * @param {Object} e - The event object.
   */
  const handleImageChange = (e) => {
    setMealData({ ...mealData, images: e.target.files });
  };

  /**
   * Handles form submission to update the meal.
   * @param {Object} e - The event object.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate that an address has been selected
    if (!mealData.addressId) {
      alert("Please select a valid address using the address selector.");
      return;
    }

    try {
      // Prepare meal data
      const mealDataToSend = prepareMealData(mealData);

      // Initialize FormData
      const formData = new FormData();

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

      // Send PUT request to update the meal
      await api.put(`/api/meals/update/${id}`, formData, {
        // Use `api` instead of `axios`
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Meal updated successfully");
      navigate("/profile");
    } catch (error) {
      console.error("Error updating meal:", error);
      alert(
        "Error updating meal: " + (error.response?.data?.error || error.message)
      );
    }
  };

  if (!user) {
    return <p>Please log in to edit a meal.</p>;
  }

  if (loading) {
    return <p>Loading meal data...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!mealData) {
    return <p>Meal data not found.</p>;
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
    setSelectedAddressId(selectedAddressId);
  };

  return (
    <form onSubmit={handleSubmit} className="edit-meal-form">
      <h2>Edit Meal</h2>

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
      />
      <input
        type="number"
        name="nutritionalInfo.protein"
        placeholder="Protein (g)"
        value={mealData.nutritionalInfo.protein}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="nutritionalInfo.fat"
        placeholder="Fat (g)"
        value={mealData.nutritionalInfo.fat}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="nutritionalInfo.carbs"
        placeholder="Carbs (g)"
        value={mealData.nutritionalInfo.carbs}
        onChange={handleChange}
        required
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
        value={
          mealData.expirationDate
            ? mealData.expirationDate.substring(0, 10)
            : ""
        }
        onChange={handleChange}
        required
      />
      <input
        type="date"
        name="preparationDate"
        placeholder="Preparation Date"
        value={
          mealData.preparationDate
            ? mealData.preparationDate.substring(0, 10)
            : ""
        }
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
      {/* Display selected address ID for confirmation */}
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
      <button type="submit">Update Meal</button>
    </form>
  );
};

export default EditMealForm;
