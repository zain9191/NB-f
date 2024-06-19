// File: /components/MealForm.jsx
import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";

const MealForm = () => {
  const { user } = useContext(AuthContext);
  const [mealData, setMealData] = useState({
    name: "",
    description: "",
    price: "",
  });

  const handleChange = (e) => {
    setMealData({ ...mealData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/meals/create", mealData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
      <button type="submit">Create Meal</button>
    </form>
  );
};

export default MealForm;
