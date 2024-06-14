import React, { useEffect, useState } from "react";
import axios from "axios";

const FoodList = () => {
  const [foodItems, setFoodItems] = useState([]);

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const response = await axios.get("/api/food");
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
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FoodList;
