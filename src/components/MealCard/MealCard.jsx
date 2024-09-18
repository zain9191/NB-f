// File: src/components/MealCard/MealCard.jsx
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./MealCard.css";
import { CartContext } from "../../contexts/CartContext";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const MealCard = ({
  meal,
  showAddToCart = true,
  showEditButton = false,
  clickable = true,
  onEdit,
}) => {
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(meal);
    alert(`${meal.name} has been added to your cart.`);
  };

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    // arrows: true, // Show next and previous arrows
    autoplay: true, // Enable autoplay
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
          src="/path/to/default-image.jpg" // Provide a default image path
          alt={meal.name}
          className="meal-card-image"
        />
      )}
      <h3>{meal.name}</h3>
      <p>Price: ${meal.price}</p>
      <p>{meal.description.substring(0, 100)}...</p>
    </>
  );

  return (
    <div className="meal-card">
      {clickable ? (
        <Link to={`/meals/${meal._id}`}>{content}</Link>
      ) : (
        <div>{content}</div>
      )}
      {showAddToCart && <button onClick={handleAddToCart}>Add to Cart</button>}
      {showEditButton && <button onClick={onEdit}>Edit Meal</button>}
    </div>
  );
};

export default MealCard;
