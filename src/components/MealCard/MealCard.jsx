import React from "react";
import { Link } from "react-router-dom";
import "./MealCard.css";

const MealCard = ({ meal }) => {
  return (
    <div className="meal-card">
      <Link to={`/meals/${meal._id}`}>
        {meal.images && meal.images[0] && (
          <img
            src={`${process.env.REACT_APP_API_BASE_URL}/${meal.images[0]}`}
            alt={meal.name}
            className="meal-card-image"
          />
        )}
        <h3>{meal.name}</h3>
        <p>Price: ${meal.price}</p>
        <p>{meal.description.substring(0, 100)}...</p>
      </Link>
    </div>
  );
};

export default MealCard;
