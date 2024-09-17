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
    calories: "",
    protein: "",
    fat: "",
    carbs: "",
    dietaryRestrictions: "",
    expirationDate: "",
    pickupDeliveryOptions: "",
    location: "",
    preparationDate: "",
    packagingInformation: "",
    healthSafetyCompliance: "",
    contactEmail: "",
    contactPhone: "",
    paymentOptions: "",
    preparationMethod: "",
    cookingInstructions: "",
    additionalNotes: "",
    tags: "",
    sellerRating: "",
    mealId: "",
    quantityAvailable: "",
    discountsPromotions: "",
    images: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMealData({ ...mealData, [name]: value });
  };

  const handleImageChange = (e) => {
    setMealData({ ...mealData, images: e.target.files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (let key in mealData) {
      if (key === "images") {
        for (let i = 0; i < mealData.images.length; i++) {
          formData.append("images", mealData.images[i]);
        }
      } else {
        formData.append(key, mealData[key]);
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
      console.error("Error creating meal", error);
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

      {/* Additional Fields */}
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
      <input
        type="number"
        name="calories"
        placeholder="Calories"
        value={mealData.calories}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="protein"
        placeholder="Protein (g)"
        value={mealData.protein}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="fat"
        placeholder="Fat (g)"
        value={mealData.fat}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="carbs"
        placeholder="Carbs (g)"
        value={mealData.carbs}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="dietaryRestrictions"
        placeholder="Dietary Restrictions"
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
      <input
        type="text"
        name="location"
        placeholder="Location"
        value={mealData.location}
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
      <input
        type="email"
        name="contactEmail"
        placeholder="Contact Email"
        value={mealData.contactEmail}
        onChange={handleChange}
        required
      />
      <input
        type="tel"
        name="contactPhone"
        placeholder="Contact Phone"
        value={mealData.contactPhone}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="paymentOptions"
        placeholder="Payment Options"
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
        type="text"
        name="sellerRating"
        placeholder="Seller Rating"
        value={mealData.sellerRating}
        onChange={handleChange}
      />
      <input
        type="text"
        name="mealId"
        placeholder="Meal ID"
        value={mealData.mealId}
        onChange={handleChange}
        required
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
