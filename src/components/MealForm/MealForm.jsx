// File: /Users/zainfrayha/Desktop/Code/mummys-food-front/src/components/MealForm/MealForm.jsx

import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";

const MealForm = () => {
  const { user } = useContext(AuthContext);
  const [mealData, setMealData] = useState({
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
    location: {
      address: "",
      city: "",
      state: "",
      zipCode: "",
      coordinates: {
        lat: "",
        lng: "",
      },
    },
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
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMealData((prevData) => {
      const keys = name.split(".");
      const lastKey = keys.pop();
      const nestedData = { ...prevData };

      let temp = nestedData;
      for (let key of keys) {
        if (!temp[key]) temp[key] = {};
        temp = temp[key];
      }
      temp[lastKey] = value;
      return nestedData;
    });
  };

  const handleImageChange = (e) => {
    setMealData({ ...mealData, images: e.target.files });
  };

  // Adjusted flattenObject function
  const flattenObject = (obj, parentKey = "", result = {}) => {
    for (let key in obj) {
      const propName = parentKey ? `${parentKey}[${key}]` : key;
      if (
        typeof obj[key] === "object" &&
        obj[key] !== null &&
        !(obj[key] instanceof FileList)
      ) {
        flattenObject(obj[key], propName, result);
      } else {
        result[propName] = obj[key];
      }
    }
    return result;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    const flatData = flattenObject(mealData);

    for (let key in flatData) {
      if (key === "images") {
        for (let i = 0; i < flatData.images.length; i++) {
          formData.append("images", flatData.images[i]);
        }
      } else {
        formData.append(key, flatData[key]);
      }
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/meals/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Meal created successfully");
    } catch (error) {
      console.error(
        "Error creating meal",
        error.response?.data || error.message
      );
      alert(
        "Error creating meal: " + (error.response?.data?.error || error.message)
      );
    }
  };

  if (!user) {
    return <p>Please log in to create a meal.</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create a Meal</h2>
      <input
        type="text"
        name="name"
        placeholder="Meal Name"
        value={mealData.name}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="description"
        placeholder="Description"
        value={mealData.description}
        onChange={handleChange}
        required
      />
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

      <input
        type="text"
        name="dietaryRestrictions"
        placeholder="Dietary Restrictions (comma-separated)"
        value={mealData.dietaryRestrictions}
        onChange={handleChange}
      />
      <input
        type="date"
        name="expirationDate"
        placeholder="Expiration Date"
        value={mealData.expirationDate}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="pickupDeliveryOptions"
        placeholder="Pickup/Delivery Options"
        value={mealData.pickupDeliveryOptions}
        onChange={handleChange}
        required
      />

      {/* Location */}
      <h3>Location</h3>
      <input
        type="text"
        name="location.address"
        placeholder="Address"
        value={mealData.location.address}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="location.city"
        placeholder="City"
        value={mealData.location.city}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="location.state"
        placeholder="State"
        value={mealData.location.state}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="location.zipCode"
        placeholder="Zip Code"
        value={mealData.location.zipCode}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        step="any"
        name="location.coordinates.lat"
        placeholder="Latitude"
        value={mealData.location.coordinates.lat}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        step="any"
        name="location.coordinates.lng"
        placeholder="Longitude"
        value={mealData.location.coordinates.lng}
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

      <input
        type="file"
        name="images"
        multiple
        onChange={handleImageChange}
        required
      />
      <button type="submit">Create Meal</button>
    </form>
  );
};

export default MealForm;
