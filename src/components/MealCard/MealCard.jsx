// File: src/components/MealCard/MealCard.jsx

import React, { useContext } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import { Link, useNavigate } from "react-router-dom";
import "./MealCard.css";
import { CartContext } from "../../contexts/CartContext";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import api from "../../utils/api";

const MealCard = ({
  meal,
  showAddToCart = true,
  showEditButton = false,
  showDeleteButton = false,
  clickable = true,
  onEdit,
  onDelete,
}) => {
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(meal);
    alert(`${meal.name} has been added to your cart.`);
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    if (window.confirm(`Are you sure you want to delete "${meal.name}"?`)) {
      try {
        await api.delete(`/api/meals/${meal._id}`);
        alert("Meal deleted successfully.");
        // Optionally, trigger a state update or refetch meals
        // For example, you might navigate away or refresh the meal list
        // navigate("/meals"); // Example navigation
      } catch (error) {
        console.error("Error deleting meal:", error);
        alert("Failed to delete meal.");
      }
    }
  };

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000, // Autoplay speed in milliseconds
  };

  const content = (
    <>
      {meal.images && meal.images.length > 0 ? (
        <Slider {...carouselSettings} className="meal-card-slider">
          {meal.images.map((img, index) => (
            <div key={index}>
              <img
                src={`${process.env.REACT_APP_API_BASE_URL}/${img}`}
                alt={`${meal.name} ${index + 1}`}
                className="meal-card-image"
              />
            </div>
          ))}
        </Slider>
      ) : (
        <img
          src="/path/to/default-image.jpg"
          alt={meal.name}
          className="meal-card-image"
        />
      )}
      <h3>{meal.name || "Unnamed Meal"}</h3>
      <p>Price: ${meal.price !== undefined ? meal.price.toFixed(2) : "N/A"}</p>
      <p>
        {meal.description && meal.description.length > 100
          ? `${meal.description.substring(0, 100)}...`
          : meal.description || "No description available."}
      </p>

      {/* Conditional Rendering for Location */}
      {meal.address ? (
        <p className="meal-location">
          Location:{" "}
          {`${meal.address.city || "N/A"}, ${meal.address.state || "N/A"}`}
        </p>
      ) : (
        <p className="meal-location">Location: N/A</p>
      )}

      {/* Conditional Rendering for Nutritional Information */}
      {meal.nutritionalInfo ? (
        <div className="meal-nutrition">
          <h4>Nutritional Information:</h4>
          <p>Calories: {meal.nutritionalInfo.calories || "N/A"}</p>
          <p>Protein: {meal.nutritionalInfo.protein || "N/A"}g</p>
          <p>Fat: {meal.nutritionalInfo.fat || "N/A"}g</p>
          <p>Carbs: {meal.nutritionalInfo.carbs || "N/A"}g</p>
          <p>
            Vitamins:{" "}
            {meal.nutritionalInfo.vitamins &&
            meal.nutritionalInfo.vitamins.length > 0
              ? meal.nutritionalInfo.vitamins.join(", ")
              : "N/A"}
          </p>
        </div>
      ) : (
        <div className="meal-nutrition">
          <h4>Nutritional Information:</h4>
          <p>N/A</p>
        </div>
      )}
    </>
  );

  // Determine which delete handler to use
  const deleteHandler = onDelete || handleDelete;

  return (
    <div className="meal-card">
      {clickable ? (
        <Link to={`/meals/${meal._id}`} className="meal-card-link">
          {content}
        </Link>
      ) : (
        <div>{content}</div>
      )}
      <div className="meal-card-actions">
        {showAddToCart && (
          <button onClick={handleAddToCart} className="add-to-cart-button">
            Add to Cart
          </button>
        )}
        {showEditButton && (
          <button onClick={onEdit} className="edit-meal-button">
            Edit Meal
          </button>
        )}
        {showDeleteButton && (
          <button onClick={deleteHandler} className="delete-meal-button">
            Delete Meal
          </button>
        )}
      </div>
    </div>
  );
};

// Define PropTypes for the component
MealCard.propTypes = {
  meal: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    images: PropTypes.arrayOf(PropTypes.string),
    address: PropTypes.shape({
      city: PropTypes.string,
      state: PropTypes.string,
    }),
    nutritionalInfo: PropTypes.shape({
      calories: PropTypes.number,
      protein: PropTypes.number,
      fat: PropTypes.number,
      carbs: PropTypes.number,
      vitamins: PropTypes.arrayOf(PropTypes.string),
    }),
  }).isRequired,
  showAddToCart: PropTypes.bool,
  showEditButton: PropTypes.bool,
  showDeleteButton: PropTypes.bool,
  clickable: PropTypes.bool,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

export default MealCard;
