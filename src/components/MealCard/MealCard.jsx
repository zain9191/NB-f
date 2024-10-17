// src/components/MealCard/MealCard.jsx
import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "./MealCard.css";
import { CartContext } from "../../contexts/CartContext";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import api from "../../utils/api";

const MealCard = React.memo(
  ({
    meal,
    showAddToCart = true,
    showEditButton = false,
    showDeleteButton = false,
    clickable = true,
    onEdit,
    onDelete,
  }) => {
    const { addToCart } = useContext(CartContext);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isAddingToCart, setIsAddingToCart] = useState(false);

    const handleAddToCart = async (e) => {
      e.preventDefault();
      setIsAddingToCart(true);
      try {
        addToCart(meal);
        alert(`${meal.name} has been added to your cart.`);
      } catch (error) {
        console.error("Error adding to cart:", error);
        alert("Failed to add meal to cart.");
      } finally {
        setIsAddingToCart(false);
      }
    };

    const handleDelete = async (e) => {
      e.preventDefault();
      if (window.confirm(`Are you sure you want to delete "${meal.name}"?`)) {
        setIsDeleting(true);
        try {
          const response = await api.delete(`/api/meals/${meal._id}`);
          if (response.data.success) {
            alert("Meal deleted successfully.");
            if (onDelete) {
              onDelete(meal._id); // Notify parent to update state
            }
          } else {
            alert(response.data.error || "Failed to delete meal.");
          }
        } catch (error) {
          console.error("Error deleting meal:", error);
          if (
            error.response &&
            error.response.data &&
            error.response.data.error
          ) {
            alert(`Error: ${error.response.data.error}`);
          } else {
            alert("Failed to delete meal.");
          }
        } finally {
          setIsDeleting(false);
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
      autoplaySpeed: 3000,
    };

    const content = (
      <>
        {meal.images && meal.images.length > 0 ? (
          <Slider {...carouselSettings} className="meal-card-slider">
            {meal.images.map((img, index) => (
              <div key={index}>
                <img
                  src={`${api.defaults.baseURL}/${img}`}
                  alt={`${meal.name} ${index + 1}`}
                  className="meal-card-image"
                  loading="lazy"
                />
              </div>
            ))}
          </Slider>
        ) : (
          <img
            src={`${api.defaults.baseURL}/uploads/${meal.images}`}
            alt={meal.name}
            className="meal-card-image"
            loading="lazy"
          />
        )}
        <h3>{meal.name || "Unnamed Meal"}</h3>
        <p>
          Price: ${meal.price !== undefined ? meal.price.toFixed(2) : "N/A"}
        </p>
        <p>
          {meal.description && meal.description.length > 100
            ? `${meal.description.substring(0, 100)}...`
            : meal.description || "No description available."}
        </p>

        {meal.address ? (
          <p className="meal-location">
            Location:{" "}
            {`${meal.address.city || "N/A"}, ${meal.address.state || "N/A"}`}
          </p>
        ) : (
          <p className="meal-location">Location: N/A</p>
        )}

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

    const deleteHandler = onDelete || handleDelete;

    return (
      <div className="meal-card">
        <div className="meal-card-content">
          {clickable ? (
            <Link to={`/meals/${meal._id}`} className="meal-card-link">
              {content}
            </Link>
          ) : (
            <div>{content}</div>
          )}
        </div>
        <div className="meal-card-actions">
          {showAddToCart && (
            <button
              onClick={handleAddToCart}
              className="add-to-cart-button"
              disabled={isAddingToCart}
              aria-label={`Add ${meal.name} to cart`}
            >
              {isAddingToCart ? "Adding..." : "Add to Cart"}
            </button>
          )}
          {showEditButton && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (onEdit) {
                  onEdit();
                }
              }}
              className="edit-meal-button"
              aria-label={`Edit ${meal.name}`}
            >
              Edit Meal
            </button>
          )}
          {showDeleteButton && (
            <button
              onClick={deleteHandler}
              className="delete-meal-button"
              disabled={isDeleting}
              aria-label={`Delete ${meal.name}`}
            >
              {isDeleting ? "Deleting..." : "Delete Meal"}
            </button>
          )}
        </div>
      </div>
    );
  }
);

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
