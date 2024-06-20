// components/MealsList.jsx
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
            <p>${meal.price}</p>
            <p>{meal.ingredients.join(", ")}</p>
            {meal.images.map((img, index) => (
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
