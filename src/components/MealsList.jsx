import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { CartContext } from "../contexts/CartContext";

const MealsList = () => {
  const [meals, setMeals] = useState([]);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await axios.get("http://localhost:5080/api/meals");
        setMeals(response.data);
      } catch (error) {
        console.error("Error fetching meals", error);
      }
    };

    fetchMeals();
  }, []);

  return (
    <div>
      <h2>Meals List</h2>
      <ul>
        {meals.map((meal) => (
          <li key={meal._id}>
            <h3>{meal.name}</h3>
            <p>{meal.description}</p>
            <p>Category: {meal.category || "N/A"}</p>
            <p>Cuisine: {meal.cuisine || "N/A"}</p>
            <p>Portion Size: {meal.portionSize || "N/A"}</p>
            <p>Price: ${meal.price}</p>
            <p>
              Ingredients:{" "}
              {(meal.ingredients && meal.ingredients.join(", ")) || "N/A"}
            </p>
            <p>Calories: {meal.nutritionalInfo?.calories || "N/A"}</p>
            <p>Protein: {meal.nutritionalInfo?.protein || "N/A"}g</p>
            <p>Fat: {meal.nutritionalInfo?.fat || "N/A"}g</p>
            <p>Carbs: {meal.nutritionalInfo?.carbs || "N/A"}g</p>
            <p>
              Dietary Restrictions:{" "}
              {(meal.dietaryRestrictions &&
                meal.dietaryRestrictions.join(", ")) ||
                "N/A"}
            </p>
            <p>Pickup/Delivery: {meal.pickupDeliveryOptions || "N/A"}</p>
            <p>
              Location: {meal.location?.address}, {meal.location?.city || "N/A"}
            </p>
            <p>Availability: {meal.availabilityStatus || "N/A"}</p>
            <p>
              Preparation Date:{" "}
              {meal.preparationDate
                ? new Date(meal.preparationDate).toLocaleDateString()
                : "N/A"}
            </p>
            <p>Packaging: {meal.packagingInformation || "N/A"}</p>
            <p>Health & Safety: {meal.healthSafetyCompliance || "N/A"}</p>
            <p>
              Contact: {meal.contactInformation?.email || "N/A"},{" "}
              {meal.contactInformation?.phone || "N/A"}
            </p>
            <p>
              Payment Options:{" "}
              {(meal.paymentOptions && meal.paymentOptions.join(", ")) || "N/A"}
            </p>
            <p>Tags: {(meal.tags && meal.tags.join(", ")) || "N/A"}</p>
            {meal.images?.map((img, index) => (
              <img
                key={index}
                src={`http://localhost:5080/${img}`}
                alt={meal.name}
                width="100"
              />
            ))}
            <button onClick={() => addToCart(meal)}>Add to Cart</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MealsList;
