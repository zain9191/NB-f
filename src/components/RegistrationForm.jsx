import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";

const Form = styled.form`
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;
const FormGroup = styled.div`
  margin-bottom: 15px;
  padding: 10px 0; /* Add padding for better spacing */
`;
const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
`;
const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
`;
const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 18px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:5080",
});

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    zipCode: "",
  });
  const [error, setError] = useState(null); // Add state for error handling

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset error state
    try {
      const endpoint = "/api/users/register";
      const response = await api.post(endpoint, formData);

      if (response.data && response.data.token) {
        const token = response.data.token;
        localStorage.setItem("token", token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        alert("Registration successful!");
      } else {
        console.error("Token not found in the response:", response.data);
        setError("Registration failed, please try again.");
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      setError("Registration failed, please try again."); // Set error message for user feedback
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label>Name:</Label>
        <Input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </FormGroup>
      <FormGroup>
        <Label>Email:</Label>
        <Input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </FormGroup>
      <FormGroup>
        <Label>Password:</Label>
        <Input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </FormGroup>
      <FormGroup>
        <Label>Phone Number:</Label>
        <Input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </FormGroup>
      <FormGroup>
        <Label>Zip Code:</Label>
        <Input
          type="text"
          name="zipCode"
          value={formData.zipCode}
          onChange={handleChange}
          required
        />
      </FormGroup>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <Button type="submit">Register</Button>
    </Form>
  );
};

export default RegistrationForm;
