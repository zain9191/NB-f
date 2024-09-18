// File: /Users/zainfrayha/Desktop/Code/mummys-food-front/src/components/EditMealForm.jsx
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";

const EditMealForm = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams(); // Get the meal ID from URL parameters
  const navigate = useNavigate();
  const [mealData, setMealData] = useState(null); // Initialize mealData as null
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchMeal = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/meals/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Check if the logged-in user is the creator of the meal
        if (response.data.createdBy._id.toString() !== user._id.toString()) {
          alert("You are not authorized to edit this meal.");
          navigate("/profile");
          return;
        }

        // Convert array fields to comma-separated strings
        const fetchedMeal = response.data;
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

        setMealData(processedMeal);
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
    const mealDataToSend = {
      ...mealData,
      ingredients: mealData.ingredients.split(",").map((item) => item.trim()),
      tags: mealData.tags.split(",").map((item) => item.trim()),
      dietaryRestrictions: mealData.dietaryRestrictions
        .split(",")
        .map((item) => item.trim()),
      paymentOptions: mealData.paymentOptions
        .split(",")
        .map((item) => item.trim()),
      nutritionalInfo: {
        ...mealData.nutritionalInfo,
        vitamins: mealData.nutritionalInfo.vitamins
          .split(",")
          .map((item) => item.trim()),
      },
    };
    const flatData = flattenObject(mealDataToSend);

    for (let key in flatData) {
      if (key === "images" && flatData.images instanceof FileList) {
        for (let i = 0; i < flatData.images.length; i++) {
          formData.append("images", flatData.images[i]);
        }
      } else if (Array.isArray(flatData[key])) {
        flatData[key].forEach((value) => {
          formData.append(`${key}[]`, value);
        });
      } else {
        formData.append(key, flatData[key]);
      }
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/api/meals/update/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Meal updated successfully");
      navigate("/profile");
    } catch (error) {
      console.error("Error updating meal:", error);
      alert("Error updating meal");
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

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Meal</h2>
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
        value={mealData.ingredients} // Removed .join(", ")
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
        value={mealData.nutritionalInfo.vitamins} // Removed .join(", ")
        onChange={handleChange}
      />

      <input
        type="text"
        name="dietaryRestrictions"
        placeholder="Dietary Restrictions (comma-separated)"
        value={mealData.dietaryRestrictions} // Removed .join(", ")
        onChange={handleChange}
      />
      <input
        type="date"
        name="expirationDate"
        placeholder="Expiration Date"
        value={mealData.expirationDate.substring(0, 10)}
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
        value={mealData.preparationDate.substring(0, 10)}
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
        value={mealData.paymentOptions} // Removed .join(", ")
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
        value={mealData.tags} // Removed .join(", ")
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

      <input type="file" name="images" multiple onChange={handleImageChange} />
      <button type="submit">Update Meal</button>
    </form>
  );
};

export default EditMealForm;
