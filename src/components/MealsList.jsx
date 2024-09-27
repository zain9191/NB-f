import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import api from "../utils/api";
import MealCard from "./MealCard/MealCard";

const MealsList = ({ searchParams }) => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMeals = async () => {
      setLoading(true);
      setError(null);
      try {
        // Ensure searchParams are passed correctly
        const response = await api.get("/api/meals", {
          params: searchParams, // Already correctly passing searchParams
        });
        setMeals(response.data);
      } catch (err) {
        console.error("Error fetching meals", err);
        setError("Failed to fetch meals. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, [searchParams]);

  return (
    <div>
      <h2>Meals List</h2>
      {loading && <p>Loading meals...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && (
        <div className="meals-grid">
          {meals.length > 0 ? (
            meals.map((meal) => <MealCard key={meal._id} meal={meal} />)
          ) : (
            <p>No meals found.</p>
          )}
        </div>
      )}
    </div>
  );
};

// Define PropTypes for better type checking
MealsList.propTypes = {
  searchParams: PropTypes.object,
};

export default MealsList;
