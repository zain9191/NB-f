// src/components/MealsList/MealsList.jsx

import React, { useEffect, useState } from "react";
import api from "../../utils/api"; // Use your configured api instance
import MealCard from "../MealCard/MealCard"; // Ensure this component exists
import "./MealsList.css"; // Ensure appropriate styling

const MealsList = ({ searchParams }) => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMeals = async () => {
      setLoading(true);
      setError(null);
      try {
        // Build query parameters string from searchParams
        const params = new URLSearchParams();

        // Iterate over searchParams and add them to params
        Object.entries(searchParams).forEach(([key, value]) => {
          if (value && value !== "" && value !== null) {
            if (key === "coordinates" && value.lat && value.lng) {
              // Handle coordinates
              params.append("lat", value.lat);
              params.append("lng", value.lng);
            } else if (key === "radius") {
              params.append("radius", value);
            } else {
              params.append(key, value);
            }
          }
        });

        const response = await api.get(`/api/meals?${params.toString()}`);

        // Set meals directly from response.data
        setMeals(response.data.data || []); // Adjust based on backend response
      } catch (err) {
        console.error("Error fetching meals:", err);
        setError("Failed to load meals.");
      } finally {
        setLoading(false);
      }
    };

    // Fetch meals only if at least one search parameter is present
    if (
      searchParams.search ||
      (searchParams.coordinates &&
        searchParams.coordinates.lat &&
        searchParams.coordinates.lng)
    ) {
      fetchMeals();
    } else {
      // Optionally, fetch all meals or prompt user to perform a search
      setMeals([]);
    }
  }, [searchParams]);

  if (loading) return <div>Loading meals...</div>;
  if (error) return <div className="error">{error}</div>;
  if (meals.length === 0)
    return <div>No meals found. Please try a different search.</div>;

  return (
    <div className="meals-list">
      {meals.map((meal) => (
        <MealCard key={meal._id} meal={meal} />
      ))}
    </div>
  );
};

export default MealsList;
