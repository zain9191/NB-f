// File: src/components/MealsList.jsx
import React, { useEffect, useState, useContext } from "react";
import api from "../utils/api";
import { CartContext } from "../contexts/CartContext";
import MealCard from "./MealCard/MealCard";

const MealsList = () => {
  const [meals, setMeals] = useState([]);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await api.get("/api/meals");
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
      <div className="meals-grid">
        {meals.map((meal) => (
          <MealCard key={meal._id} meal={meal} />
        ))}
      </div>
    </div>
  );
};

export default MealsList;
