import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../utils/api";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import "./MealDetailPage.css";

const MealDetailPage = () => {
  const { id } = useParams();
  const [meal, setMeal] = useState(null);

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

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  return (
    <div className="meal-detail-container">
      <div className="meal-detail">
        <div className="meal-images">
          <Slider {...sliderSettings}>
            {meal.images?.map((img, index) => (
              <div key={index}>
                <img
                  src={`${process.env.REACT_APP_API_BASE_URL}/${img}`}
                  alt={`${meal.name} ${index + 1}`}
                  className="carousel-image"
                />
              </div>
            ))}
          </Slider>
        </div>
        <div className="meal-info">
          <h1>{meal.name}</h1>
          <p className="meal-price">Price: ${meal.price}</p>
          <p className="meal-description">{meal.description}</p>
          <div className="meal-details">
            <h2>Details</h2>
            <p>
              <strong>Category:</strong> {meal.category || "N/A"}
            </p>
            <p>
              <strong>Cuisine:</strong> {meal.cuisine || "N/A"}
            </p>
            <p>
              <strong>Portion Size:</strong> {meal.portionSize || "N/A"}
            </p>
            <p>
              <strong>Ingredients:</strong>{" "}
              {meal.ingredients?.join(", ") || "N/A"}
            </p>
            <p>
              <strong>Dietary Restrictions:</strong>{" "}
              {meal.dietaryRestrictions?.join(", ") || "N/A"}
            </p>
            <p>
              <strong>Tags:</strong> {meal.tags?.join(", ") || "N/A"}
            </p>
          </div>
          <div className="meal-nutrition">
            <h2>Nutritional Information</h2>
            <p>
              <strong>Calories:</strong>{" "}
              {meal.nutritionalInfo?.calories || "N/A"}
            </p>
            <p>
              <strong>Protein:</strong> {meal.nutritionalInfo?.protein}g
            </p>
            <p>
              <strong>Fat:</strong> {meal.nutritionalInfo?.fat}g
            </p>
            <p>
              <strong>Carbs:</strong> {meal.nutritionalInfo?.carbs}g
            </p>
            <p>
              <strong>Vitamins:</strong>{" "}
              {meal.nutritionalInfo?.vitamins?.join(", ") || "N/A"}
            </p>
          </div>
          <div className="meal-additional">
            <h2>Additional Information</h2>
            <p>
              <strong>Expiration Date:</strong>{" "}
              {new Date(meal.expirationDate).toLocaleDateString() || "N/A"}
            </p>
            <p>
              <strong>Preparation Date:</strong>{" "}
              {new Date(meal.preparationDate).toLocaleDateString() || "N/A"}
            </p>
            <p>
              <strong>Pickup/Delivery Options:</strong>{" "}
              {meal.pickupDeliveryOptions || "N/A"}
            </p>
            <p>
              <strong>Location:</strong> {meal.location?.address || "N/A"}
            </p>
            <p>
              <strong>Preparation Method:</strong>{" "}
              {meal.preparationMethod || "N/A"}
            </p>
            <p>
              <strong>Cooking Instructions:</strong>{" "}
              {meal.cookingInstructions || "N/A"}
            </p>
            <p>
              <strong>Additional Notes:</strong> {meal.additionalNotes || "N/A"}
            </p>
          </div>
          <div className="meal-contact">
            <h2>Contact Information</h2>
            <p>
              <strong>Email:</strong> {meal.contactInformation?.email || "N/A"}
            </p>
            <p>
              <strong>Phone:</strong> {meal.contactInformation?.phone || "N/A"}
            </p>
          </div>
          <div className="meal-payment">
            <h2>Payment Options</h2>
            <p>{meal.paymentOptions?.join(", ") || "N/A"}</p>
          </div>
          <div className="meal-quantity">
            <p>
              <strong>Quantity Available:</strong> {meal.quantityAvailable}
            </p>
          </div>
          <button className="add-to-cart-button">Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

export default MealDetailPage;
