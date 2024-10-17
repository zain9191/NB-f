import React from "react";
import MealCard from "../MealCard/MealCard";
// import "./MealList.css";

const MealList = ({ meals, onEdit, onDelete }) => {
  return (
    <div className="meals-grid">
      {meals.length > 0 ? (
        meals.map((meal) => (
          <MealCard
            key={meal._id}
            meal={meal}
            showEditButton
            showDeleteButton
            onEdit={() => onEdit(meal._id)}
            onDelete={() => onDelete(meal._id)}
          />
        ))
      ) : (
        <p>No meals available.</p>
      )}
    </div>
  );
};

export default MealList;
