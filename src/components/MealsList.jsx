// File: src/components/MealsList.jsx

import React, { useEffect, useState } from "react";
import api from "../utils/api";
import MealCard from "./MealCard/MealCard";
import { useLocation } from "react-router-dom";

const MealsList = ({ zipCode }) => {
  const [meals, setMeals] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        // Parse query parameters from URL
        const params = new URLSearchParams(location.search);

        // If zipCode prop is provided, set it in the params
        if (zipCode) {
          params.set("zipCode", zipCode);
        }

        // Construct params object for the API request
        const searchParams = {};
        for (const [key, value] of params.entries()) {
          searchParams[key] = value;
        }

        const response = await api.get("/api/meals", {
          params: searchParams,
        });
        setMeals(response.data);
      } catch (error) {
        console.error("Error fetching meals", error);
      }
    };

    fetchMeals();
  }, [location.search, zipCode]);

  return (
    <div>
      <h2>Meals List</h2>
      <div className="meals-grid">
        {meals.length > 0 ? (
          meals.map((meal) => <MealCard key={meal._id} meal={meal} />)
        ) : (
          <p>No meals found.</p>
        )}
      </div>
    </div>
  );
};

export default MealsList;
