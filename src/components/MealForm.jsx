import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";

const MealForm = () => {
  const { user } = useContext(AuthContext);
  const [mealData, setMealData] = useState({
    name: "",
    description: "",
    price: "",
    ingredients: "",
    images: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMealData({ ...mealData, [name]: value });
  };

  const handleImageChange = (e) => {
    setMealData({ ...mealData, images: e.target.files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (let key in mealData) {
      if (key === "images") {
        for (let i = 0; i < mealData.images.length; i++) {
          formData.append("images", mealData.images[i]);
        }
      } else {
        formData.append(key, mealData[key]);
      }
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/meals/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Meal created successfully");
    } catch (error) {
      console.error("Error creating meal", error);
    }
  };

  if (!user || user.role !== "chef") {
    return <p>Access denied. Only chefs can create meals.</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create a Meal</h2>
      <input
        type="text"
        name="name"
        placeholder="Meal Name"
        value={mealData.name}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="description"
        placeholder="Description"
        value={mealData.description}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="price"
        placeholder="Price"
        value={mealData.price}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="ingredients"
        placeholder="Ingredients (comma-separated)"
        value={mealData.ingredients}
        onChange={handleChange}
        required
      />
      <input
        type="file"
        name="images"
        multiple
        onChange={handleImageChange}
        required
      />
      <button type="submit">Create Meal</button>
    </form>
  );
};

export default MealForm;
