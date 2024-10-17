import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import api from "../../utils/api";
import MealCard from "../MealCard/MealCard";
import "./MealsList.css";

const MealsList = ({ searchParams }) => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMeals = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = "/api/meals";
        const params = new URLSearchParams();

        Object.entries(searchParams).forEach(([key, value]) => {
          if (value && value !== "" && value !== null) {
            if (value) params.append(key, value);
            if (key === "coordinates" && value.lat && value.lng) {
              params.append("lat", value.lat);
              params.append("lng", value.lng);
            } else if (key === "radius") {
              params.append("radius", value);
            } else {
              params.append(key, value);
            }
          }
        });

        if (params.toString()) {
          url += `?${params.toString()}`;
        }

        const response = await api.get(url);

        setMeals(response.data || []);
      } catch (err) {
        console.error("Error fetching meals:", err);
        setError("Failed to load meals.");
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
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

MealsList.propTypes = {
  searchParams: PropTypes.object.isRequired,
};

export default MealsList;
