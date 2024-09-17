import React, { useState } from "react";
import styled from "styled-components";
import api from "../utils/api";

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
  padding: 10px 0;
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

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    email: "",
    password: "",
    phone_number: "",
    zipCode: "",
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await api.post("/api/auth/register", formData);

      if (response.data && response.data.token) {
        const token = response.data.token;
        localStorage.setItem("token", token);
        alert("Registration successful!");
      } else {
        console.error("Token not found in the response:", response.data);
        setError("Registration failed, please try again.");
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      setError("Registration failed, please try again.");
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label>Full Name:</Label>
        <Input
          type="text"
          name="full_name"
          placeholder="Full Name"
          value={formData.full_name}
          onChange={handleChange}
          required
        />
      </FormGroup>
      <FormGroup>
        <Label>Username:</Label>
        <Input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
      </FormGroup>
      <FormGroup>
        <Label>Email:</Label>
        <Input
          type="email"
          name="email"
          placeholder="Email"
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
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </FormGroup>
      <FormGroup>
        <Label>Phone Number:</Label>
        <Input
          type="tel"
          name="phone_number"
          placeholder="Phone Number"
          value={formData.phone_number}
          onChange={handleChange}
          required
        />
      </FormGroup>
      <FormGroup>
        <Label>Zip Code:</Label>
        <Input
          type="text"
          name="zipCode"
          placeholder="Zip Code"
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
