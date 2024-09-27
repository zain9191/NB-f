// src/components/FoodList.jsx
import React, { useEffect, useState, useContext } from "react";
import api from "../utils/api"; // Import the centralized Axios instance
import { CartContext } from "../contexts/CartContext";

const FoodList = () => {
  const [foodItems, setFoodItems] = useState([]);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const response = await api.get("/api/food"); // Use `api` instead of `axios`
        setFoodItems(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchFoodItems();
  }, []);

  return (
    <div>
      <h1>Food List</h1>
      <ul>
        {foodItems.map((item) => (
          <li key={item.id}>
            {item.name} - ${item.price}
            <button onClick={() => addToCart(item)}>Add to Cart</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FoodList;
