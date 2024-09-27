// File: src/components/MealDetailPage.jsx

import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../../utils/api";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import "./MealDetailPage.css";
import { CartContext } from "../../contexts/CartContext";

const MealDetailPage = () => {
  const { id } = useParams();
  const [meal, setMeal] = useState(null);

  const { addToCart } = useContext(CartContext);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchMeal = async () => {
      try {
        const response = await api.get(`/api/meals/${id}`);
        setMeal(response.data);
      } catch (error) {
        console.error("Error fetching meal details", error);
      }
    };

    fetchMeal();
  }, [id]);

  if (!meal) {
    return <div>Loading...</div>;
  }

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  // Add a meal to cart
  const handleAddToCart = () => {
    addToCart(meal, quantity);
    alert(`${meal?.name} has been added to your cart.`);
  };

  const sliderSettings = {
    dots: meal?.images?.length > 1,
    infinite: meal?.images?.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  return (
    <div className="meal-detail-container">
      <div className="meal-detail">
        <div className="meal-images">
          {meal?.images?.length > 0 ? (
            <Slider {...sliderSettings}>
              {meal.images.map((img, index) => (
                <div key={index}>
                  <img
                    src={`${process.env.REACT_APP_API_BASE_URL}/${img}`}
                    alt={`${meal?.name} ${index + 1}`}
                    className="carousel-image"
                  />
                </div>
              ))}
            </Slider>
          ) : (
            <img
              src="/default-meal-image.jpg" // Provide a default image path
              alt="Default Meal"
              className="carousel-image"
            />
          )}
        </div>
        <div className="meal-info">
          <h1>{meal?.name || "Meal Name"}</h1>
          <p className="meal-price">
            Price: ${meal?.price?.toFixed(2) || "N/A"}
          </p>
          <p className="meal-description">
            {meal?.description || "No description available."}
          </p>
          <div className="meal-details">
            <h2>Details</h2>
            <p>
              <strong>Category:</strong> {meal?.category || "N/A"}
            </p>
            <p>
              <strong>Cuisine:</strong> {meal?.cuisine || "N/A"}
            </p>
            <p>
              <strong>Portion Size:</strong> {meal?.portionSize || "N/A"}
            </p>
            <p>
              <strong>Ingredients:</strong>{" "}
              {meal?.ingredients?.length > 0
                ? meal.ingredients.join(", ")
                : "N/A"}
            </p>
            <p>
              <strong>Dietary Restrictions:</strong>{" "}
              {meal?.dietaryRestrictions?.length > 0
                ? meal.dietaryRestrictions.join(", ")
                : "N/A"}
            </p>
            <p>
              <strong>Tags:</strong>{" "}
              {meal?.tags?.length > 0 ? meal.tags.join(", ") : "N/A"}
            </p>
          </div>
          <div className="meal-address">
            <h2>Address</h2>
            <p>
              <strong>Street:</strong> {meal?.address?.street || "N/A"}
            </p>
            <p>
              <strong>City:</strong> {meal?.address?.city || "N/A"}
            </p>
            <p>
              <strong>State:</strong> {meal?.address?.state || "N/A"}
            </p>
            <p>
              <strong>ZIP Code:</strong> {meal?.address?.postalCode || "N/A"}
            </p>
            <p>
              <strong>Country:</strong> {meal?.address?.country || "N/A"}
            </p>
            <p>
              <strong>Formatted Address:</strong>{" "}
              {meal?.address?.formattedAddress || "N/A"}
            </p>
            <p>
              <strong>Coordinates:</strong>{" "}
              {meal?.address?.location?.coordinates
                ? `Lat: ${meal.address.location.coordinates[1]}, Lng: ${meal.address.location.coordinates[0]}`
                : "N/A"}
            </p>
          </div>
          <div className="meal-nutrition">
            <h2>Nutritional Information</h2>
            <p>
              <strong>Calories:</strong>{" "}
              {meal?.nutritionalInfo?.calories || "N/A"}
            </p>
            <p>
              <strong>Protein:</strong>{" "}
              {meal?.nutritionalInfo?.protein
                ? `${meal.nutritionalInfo.protein}g`
                : "N/A"}
            </p>
            <p>
              <strong>Fat:</strong>{" "}
              {meal?.nutritionalInfo?.fat
                ? `${meal.nutritionalInfo.fat}g`
                : "N/A"}
            </p>
            <p>
              <strong>Carbs:</strong>{" "}
              {meal?.nutritionalInfo?.carbs
                ? `${meal.nutritionalInfo.carbs}g`
                : "N/A"}
            </p>
            <p>
              <strong>Vitamins:</strong>{" "}
              {meal?.nutritionalInfo?.vitamins?.length > 0
                ? meal.nutritionalInfo.vitamins.join(", ")
                : "N/A"}
            </p>
          </div>
          <div className="meal-additional">
            <h2>Additional Information</h2>
            <p>
              <strong>Expiration Date:</strong>{" "}
              {meal?.expirationDate
                ? new Date(meal.expirationDate).toLocaleDateString()
                : "N/A"}
            </p>
            <p>
              <strong>Preparation Date:</strong>{" "}
              {meal?.preparationDate
                ? new Date(meal.preparationDate).toLocaleDateString()
                : "N/A"}
            </p>
            <p>
              <strong>Pickup/Delivery Options:</strong>{" "}
              {meal?.pickupDeliveryOptions || "N/A"}
            </p>
            <p>
              <strong>Preparation Method:</strong>{" "}
              {meal?.preparationMethod || "N/A"}
            </p>
            <p>
              <strong>Cooking Instructions:</strong>{" "}
              {meal?.cookingInstructions || "N/A"}
            </p>
            <p>
              <strong>Additional Notes:</strong>{" "}
              {meal?.additionalNotes || "N/A"}
            </p>
          </div>
          <div className="meal-contact">
            <h2>Contact Information</h2>
            <p>
              <strong>Email:</strong> {meal?.contactInformation?.email || "N/A"}
            </p>
            <p>
              <strong>Phone:</strong> {meal?.contactInformation?.phone || "N/A"}
            </p>
          </div>
          <div className="meal-payment">
            <h2>Payment Options</h2>
            <p>
              {meal?.paymentOptions?.length > 0
                ? meal.paymentOptions.join(", ")
                : "N/A"}
            </p>
          </div>
          <div className="meal-quantity">
            <p>
              <strong>Quantity Available:</strong>{" "}
              {meal?.quantityAvailable || "0"}
            </p>
          </div>
          <div className="meal-purchase">
            <label htmlFor="quantity">
              <strong>Quantity:</strong>
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              min="1"
              max={meal?.quantityAvailable || 1}
              value={quantity}
              onChange={handleQuantityChange}
            />
            <button
              className="add-to-cart-button"
              onClick={handleAddToCart}
              disabled={meal?.quantityAvailable === 0}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealDetailPage;
