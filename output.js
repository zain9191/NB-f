
// File: /Users/zainfrayha/Desktop/Code/mummys-food-front/src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Register from './pages/Register';
import ProfilePage from './pages/ProfilePage';
import Login from './pages/Login';
import PrivateRoute from './utils/PrivateRoute';
import CartProvider from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext'; // Corrected import
import MealForm from './components/MealForm';
import MealsList from './components/MealsList';
import NotFound from './pages/NotFound'; // Import the NotFound component

const App = () => (
  <AuthProvider>
    <CartProvider>
      <Router>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              }
            />
            <Route path="/create-meal" element={<PrivateRoute><MealForm /></PrivateRoute>} />
            <Route path="/meals" element={<MealsList />} />
            <Route path="*" element={<NotFound />} /> {/* Catch-all route for 404 */}
          </Routes>
        </main>
        <Footer />
      </Router>
    </CartProvider>
  </AuthProvider>
);

export default App;


// File: /Users/zainfrayha/Desktop/Code/mummys-food-front/src/components/About.jsx
import React from 'react';

function About() {
  return (
    <div>
      <h1>About Page</h1>
      <p>Learn more about us on this page.</p>
    </div>
  );
}

export default About;


// File: /Users/zainfrayha/Desktop/Code/mummys-food-front/src/components/AddressForm.jsx
import React, { useState } from "react";

const AddressForm = ({ addAddress }) => {
  const [formData, setFormData] = useState({
    addressLine: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addAddress(formData);
    setFormData({
      addressLine: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Address</h3>
      <input
        type="text"
        name="addressLine"
        placeholder="Address Line"
        value={formData.addressLine}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="city"
        placeholder="City"
        value={formData.city}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="state"
        placeholder="State"
        value={formData.state}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="zipCode"
        placeholder="Zip Code"
        value={formData.zipCode}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="country"
        placeholder="Country"
        value={formData.country}
        onChange={handleChange}
        required
      />
      <button type="submit">Add Address</button>
    </form>
  );
};

export default AddressForm;


// File: /Users/zainfrayha/Desktop/Code/mummys-food-front/src/components/Cart.jsx
import React, { useContext } from "react";
import { CartContext } from "../contexts/CartContext";

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useContext(CartContext);

  return (
    <div>
      <h2>Shopping Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <ul>
          {cart.map((item) => (
            <li key={item.id}>
              {item.name} - ${item.price}
              <button onClick={() => removeFromCart(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      {cart.length > 0 && <button onClick={clearCart}>Clear Cart</button>}
    </div>
  );
};

export default Cart;


// File: /Users/zainfrayha/Desktop/Code/mummys-food-front/src/components/FoodList.jsx
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { CartContext } from "../contexts/CartContext";

const FoodList = () => {
  const [foodItems, setFoodItems] = useState([]);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/food`
        );
        setFoodItems(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchFoodItems();
  }, []);

  return (
    <div>
      <h1>Food List</h1>
      <ul>
        {foodItems.map((item) => (
          <li key={item.id}>
            {item.name} - ${item.price}
            <button onClick={() => addToCart(item)}>Add to Cart</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FoodList;


// File: /Users/zainfrayha/Desktop/Code/mummys-food-front/src/components/Footer.jsx
import React from "react";

const Footer = () => (
  <footer style={{ marginTop: "500px" }}>
    <p>&copy; 2024 Food Selling Platform</p>
  </footer>
);

export default Footer;


// File: /Users/zainfrayha/Desktop/Code/mummys-food-front/src/components/Header.jsx
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import styled from "styled-components";

const Nav = styled.nav`
  background-color: #4caf50;
  padding: 10px 0;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NavList = styled.ul`
  list-style: none;
  display: flex;
  gap: 20px;
  margin: 0;
  padding: 0;
`;

const NavItem = styled.li`
  margin: 0;
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 18px;

  &:hover {
    text-decoration: underline;
  }
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  console.log("User:", user);
  console.log("Logout function:", logout);
  console.log("Token from localStorage:", localStorage.getItem("token"));

  return (
    <header>
      <Nav>
        <NavList>
          <NavItem>
            <NavLink to="/">Home</NavLink>
          </NavItem>
          {!user ? (
            <>
              <NavItem>
                <NavLink to="/register">Register</NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/login">Login</NavLink>
              </NavItem>
            </>
          ) : (
            <>
              <NavItem>
                <NavLink to="/profile">Profile</NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/meals">Meals</NavLink>
              </NavItem>
              <NavItem>
                <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
              </NavItem>
            </>
          )}
        </NavList>
      </Nav>
    </header>
  );
};

export default Header;


// File: /Users/zainfrayha/Desktop/Code/mummys-food-front/src/components/LoginForm.jsx
// components/LoginForm.js

import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      alert("Login successful!");
      navigate("/profile");
    } catch (error) {
      setError("Invalid credentials, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? "Loading..." : "Login"}
      </button>
    </form>
  );
};

export default LoginForm;


// File: /Users/zainfrayha/Desktop/Code/mummys-food-front/src/components/MealForm.jsx
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


// File: /Users/zainfrayha/Desktop/Code/mummys-food-front/src/components/MealsList.jsx
// components/MealsList.jsx
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { CartContext } from "../contexts/CartContext";

const MealsList = () => {
  const [meals, setMeals] = useState([]);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await axios.get("http://localhost:5080/api/meals");
        setMeals(response.data);
      } catch (error) {
        console.error("Error fetching meals", error);
      }
    };

    fetchMeals();
  }, []);

  return (
    <div>
      <h2>Meals List</h2>
      <ul>
        {meals.map((meal) => (
          <li key={meal._id}>
            <h3>{meal.name}</h3>
            <p>{meal.description}</p>
            <p>${meal.price}</p>
            <p>{meal.ingredients.join(", ")}</p>
            {meal.images.map((img, index) => (
              <img
                key={index}
                src={`http://localhost:5080/${img}`}
                alt={meal.name}
                width="100"
              />
            ))}
            <button onClick={() => addToCart(meal)}>Add to Cart</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MealsList;


// File: /Users/zainfrayha/Desktop/Code/mummys-food-front/src/components/Profile.jsx
import React, { useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import AddressForm from "./AddressForm";
import ProfilePictureUpload from "./ProfilePictureUpload"; // Ensure this import is correct
import api from "../utils/api";
import styled from "styled-components";
import axios from "axios";

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Header = styled.h1`
  color: #333;
  text-align: center;
  margin-bottom: 20px;
`;

const Info = styled.p`
  font-size: 16px;
  color: #666;
  margin: 5px 0;
`;

const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

const ProfileDetails = styled.div`
  margin-top: 20px;
`;

const ProfilPic = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #ccc;
  margin-bottom: 20px;
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  margin: 5px;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const FormContainer = styled.div`
  margin-top: 20px;
`;

const SpecialtyInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Dropdown = styled.select`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(user || null);
  const [loading, setLoading] = useState(!user);
  const [addresses, setAddresses] = useState([]);
  const [specialty, setSpecialty] = useState("");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showAddressDropdown, setShowAddressDropdown] = useState(false);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found, redirecting to login.");
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProfile(response.data);
        setAddresses(response.data.addresses || []);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.error("Unauthorized, redirecting to login.");
          navigate("/login");
        } else {
          console.error("Error fetching profile:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    if (!user) {
      fetchProfile();
    }
  }, [navigate, user]);

  const handleProfilePictureUpload = (profilePictureUrl) => {
    setProfile((prevProfile) => ({
      ...prevProfile,
      profilePicture: profilePictureUrl,
    }));
  };

  const addAddress = async (address) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.post("/api/address/add", address, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProfile((prevProfile) => ({
        ...prevProfile,
        addresses: response.data.data.addresses,
        activeAddress: response.data.data.activeAddress,
      }));
      setAddresses(response.data.data.addresses);
      setShowAddressForm(false);
      setShowAddressDropdown(true);
    } catch (error) {
      console.error("Error adding address:", error);
    }
  };

  const setActiveAddress = async (addressId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.post(
        "/api/address/set-active",
        { addressId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Assuming the API response returns the updated profile data
      const updatedProfile = response.data.data;

      setProfile((prevProfile) => ({
        ...prevProfile,
        activeAddress: updatedProfile.activeAddress,
        addresses: updatedProfile.addresses,
      }));
    } catch (error) {
      console.error("Error setting active address:", error);
    }
  };

  const becomeChef = async () => {
    try {
      const token = localStorage.getItem("token");
      await api.post(
        "/api/users/become-chef",
        { specialty },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("You are now a chef!");
      setProfile((prevProfile) => ({
        ...prevProfile,
        isChef: true,
      }));
    } catch (error) {
      console.error("Error becoming chef:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return <div>Profile data could not be loaded.</div>;
  }

  const profilePictureUrl =
    profile.profilePicture && profile.profilePicture.startsWith("/")
      ? `${window.location.protocol}//${window.location.hostname}:5080${profile.profilePicture}`
      : profile.profilePicture || "/uploads/default-pp.png";

  const handleAddressChange = (e) => {
    const value = e.target.value;
    if (value === "add-new-address") {
      setShowAddressForm(true);
      setShowAddressDropdown(false);
    } else {
      setActiveAddress(value);
      setShowAddressForm(false);
      setShowAddressDropdown(false);
    }
  };

  return (
    <Container>
      <Header>{profile.name}'s Profile</Header>
      <ProfileSection>
        <ProfilPic
          src={imageError ? "/uploads/default-pp.png" : profilePictureUrl}
          alt="Profile"
          onError={() => setImageError(true)}
        />
        <ProfilePictureUpload onUpload={handleProfilePictureUpload} />
      </ProfileSection>
      <ProfileDetails>
        <Info>Email: {profile.email}</Info>
        <Info>Phone: {profile.phone}</Info>
        <Info>ZipCode: {profile.zipCode}</Info>

        <h2>Current Address</h2>
        {profile.activeAddress ? (
          <div>
            {profile.activeAddress.addressLine}, {profile.activeAddress.city},{" "}
            {profile.activeAddress.state}, {profile.activeAddress.zipCode},{" "}
            {profile.activeAddress.country}
          </div>
        ) : (
          <p>No active address selected</p>
        )}
        <Button onClick={() => setShowAddressDropdown(!showAddressDropdown)}>
          Change Current Address
        </Button>

        {showAddressDropdown && addresses.length > 0 && (
          <>
            <Dropdown
              onChange={handleAddressChange}
              value={profile.activeAddress ? profile.activeAddress._id : ""}
            >
              <option value="" disabled>
                Select an address
              </option>
              {addresses.map((address) => (
                <option key={address._id} value={address._id}>
                  {address.addressLine}, {address.city}
                </option>
              ))}
              <option value="add-new-address">Add New Address</option>
            </Dropdown>
          </>
        )}

        {showAddressForm && (
          <FormContainer>
            <AddressForm addAddress={addAddress} />
          </FormContainer>
        )}

        {!profile.isChef && (
          <FormContainer>
            <h2>Become a Chef</h2>
            <SpecialtyInput
              type="text"
              placeholder="Specialty"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              required
            />
            <Button onClick={becomeChef}>Become a Chef</Button>
          </FormContainer>
        )}

        {profile.isChef && (
          <div>
            <Link to="/create-meal">
              <Button>Add Meal</Button>
            </Link>
          </div>
        )}
      </ProfileDetails>
    </Container>
  );
};

export default Profile;


// File: /Users/zainfrayha/Desktop/Code/mummys-food-front/src/components/ProfilePictureUpload.jsx
import React, { useState } from "react";
import axios from "axios";
import config from "../config"; // Import configuration

const ProfilePictureUpload = ({ onUpload }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("profilePicture", file);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${config.apiBaseUrl}/api/profile/upload-profile-picture`, // Use config for base URL
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onUpload(response.data.profilePicture);
      alert("Profile picture uploaded successfully");
    } catch (error) {
      console.error("Error uploading profile picture", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={handleFileChange} required />
      <button type="submit">Upload</button>
    </form>
  );
};

export default ProfilePictureUpload;


// File: /Users/zainfrayha/Desktop/Code/mummys-food-front/src/components/RegistrationForm.jsx
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
const Select = styled.select`
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
    userType: "user", // Default to "user"
    specialty: "", // Add specialty to the form data
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
      const endpoint =
        formData.userType === "chef"
          ? "/api/chefs/register"
          : "/api/users/register";
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
      <FormGroup>
        <Label>User Type:</Label>
        <Select
          name="userType"
          value={formData.userType}
          onChange={handleChange}
          required
        >
          <option value="user">User</option>
          <option value="chef">Chef</option>
        </Select>
      </FormGroup>
      {formData.userType === "chef" && (
        <FormGroup>
          <Label>Specialty:</Label>
          <Select
            name="specialty"
            value={formData.specialty}
            onChange={handleChange}
            required
          >
            <option value="">Select Specialty</option>
            <option value="Italian">Italian</option>
            <option value="Mexican">Mexican</option>
            <option value="Indian">Indian</option>
            <option value="Chinese">Chinese</option>
          </Select>
        </FormGroup>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <Button type="submit">Register</Button>
    </Form>
  );
};

export default RegistrationForm;


// File: /Users/zainfrayha/Desktop/Code/mummys-food-front/src/config.js
const config = {
  apiBaseUrl: "http://localhost:5080", 
};

export default config;


// File: /Users/zainfrayha/Desktop/Code/mummys-food-front/src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import config from "../config"; // Import the configuration

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        console.log("Token found in localStorage:", token);
        try {
          const res = await axios.get(`${config.apiBaseUrl}/api/auth`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.data && res.data._id) {
            // Adjusting to the actual response structure
            setUser(res.data);
            console.log("Fetched user:", res.data);
          } else {
            console.log("No user data found in response:", res.data);
            setUser(null);
          }
        } catch (err) {
          console.error("Error fetching user:", err);
          setUser(null);
        }
      } else {
        console.log("No token found in localStorage.");
      }
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      console.log("Attempting login with email:", email);
      const res = await axios.post(`${config.apiBaseUrl}/api/auth/login`, {
        email,
        password,
      });
      if (res.data && res.data.token) {
        localStorage.setItem("token", res.data.token);
        setUser(res.data.user);
        console.log("Login successful. User data:", res.data.user);
      } else {
        console.log("Login response missing token or user data:", res.data);
      }
    } catch (err) {
      console.error("Error during login:", err);
      throw err;
    }
  };

  const logout = () => {
    console.log("Logging out user:", user);
    localStorage.removeItem("token");
    setUser(null);
    console.log("User logged out successfully.");
  };

  useEffect(() => {
    console.log("User state changed:", user);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };


// File: /Users/zainfrayha/Desktop/Code/mummys-food-front/src/contexts/CartContext.jsx
import React, { createContext, useState } from "react";

export const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;


// File: /Users/zainfrayha/Desktop/Code/mummys-food-front/src/index.css
/* General Reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Body Styling */
body {
  font-family: 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.6;
  background-color: #f0f2f5;
  color: #333;
  margin: 0;
  padding: 0;
}

/* Header Styling */
header {
  background-color: #4CAF50; /* Fresh green color */
  color: white;
  padding: 10px 0;
}

header ul {
  list-style: none;
  display: flex;
  justify-content: center;
}

header ul li {
  margin: 0 15px;
}

header ul li a {
  color: white;
  text-decoration: none;
  font-size: 18px;
}

header ul li a:hover {
  text-decoration: underline;
}

/* Main Content Styling */
main {
  padding: 20px;
  min-height: 80vh;
}

/* Footer Styling */
footer {
  background-color: #333; /* Dark gray */
  color: white;
  text-align: center;
  padding: 10px 0;
  position: fixed;
  width: 100%;
  bottom: 0;
}

/* Form Styling */
form {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

form div {
  margin-bottom: 15px;
}

form label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

form input[type="text"],
form input[type="email"],
form input[type="password"] {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

form button {
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #FF9800; /* Vibrant orange */
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 18px;
  cursor: pointer;
}

form button:hover {
  background-color: #F57C00; /* Darker orange */
}

/* Profile Page Styling */
.profile-container {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.profile-container h1 {
  margin-bottom: 20px;
}

.profile-container p {
  font-size: 16px;
  margin-bottom: 10px;
}

/* Food List Styling */
.food-list-container {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.food-list-container h1 {
  margin-bottom: 20px;
}

.food-list-container ul {
  list-style: none;
  padding: 0;
}

.food-list-container ul li {
  padding: 10px;
  border-bottom: 1px solid #ccc;
}

.food-list-container ul li:last-child {
  border-bottom: none;
}

/* Responsive Design */
@media (max-width: 768px) {
  header ul {
    flex-direction: column;
    text-align: center;
  }

  header ul li {
    margin: 10px 0;
  }

  footer {
    position: relative;
    bottom: 0;
  }
}


// File: /Users/zainfrayha/Desktop/Code/mummys-food-front/src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

// Create a root.
const container = document.getElementById('root');
const root = createRoot(container);

// Initial render
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


// File: /Users/zainfrayha/Desktop/Code/mummys-food-front/src/pages/Home.jsx
import React from "react";
import homeBackground from "../assets/imgs/Home-main.png";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";

const HomeBackgroundImg = styled.img`
  width: 100%;
  height: auto;
`;
const HomeMainDiv = styled.div`
  position: relative;
  width: 100%;
`;
const TitleDiv = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 80%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 10px;
  border-radius: 50px;
  font-size: 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const Container = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 25px;
  overflow: hidden;
  width: fit-content;
  margin-top: 10px;
`;
const Input = styled.input`
  border: none;
  padding: 10px 15px;
  font-size: 16px;
  outline: none;
  flex: 1;

  &::placeholder {
    color: #bbb;
  }
`;
const HomeFindButton = styled.button`
  background-color: #dc143c;
  color: white;
  border: none;
  border-radius: 25px;
  padding: 10px 15px;
  margin: 5px;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: #a00016;
  }
`;
const Icon = styled.div`
  padding: 10px;
  font-size: 20px;
  color: #bbb;
`;

const ZipCodeInput = () => {
  return (
    <Container>
      <Icon>
        <FontAwesomeIcon icon={faLocationDot} />{" "}
      </Icon>
      <Input type="text" placeholder="Enter your ZIP code" />
      <HomeFindButton>Find Meals</HomeFindButton>
    </Container>
  );
};

const Home = () => (
  <HomeMainDiv>
    <div>
      <HomeBackgroundImg src={homeBackground}></HomeBackgroundImg>
    </div>
    <TitleDiv>
      <h1>Gourmet dishes created by talented local chefs</h1>
      <p>Discover nutritious, premium meals in your neighborhood.</p>
      <ZipCodeInput />
    </TitleDiv>
  </HomeMainDiv>
);

export default Home;


// File: /Users/zainfrayha/Desktop/Code/mummys-food-front/src/pages/Login.jsx
import React from "react";
import LoginForm from "../components/LoginForm";

const Login = () => (
  <div>
    <h1>Login</h1>
    <LoginForm />
  </div>
);

export default Login;


// File: /Users/zainfrayha/Desktop/Code/mummys-food-front/src/pages/NotFound.jsx
// src/pages/NotFound.js
import React from "react";

const NotFound = () => {
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
    </div>
  );
};

export default NotFound;


// File: /Users/zainfrayha/Desktop/Code/mummys-food-front/src/pages/ProfilePage.jsx
import React from "react";
import Profile from "../components/Profile";

const ProfilePage = () => (
  <div>
    <h1>Profile</h1>
    <Profile />
  </div>
);

export default ProfilePage;


// File: /Users/zainfrayha/Desktop/Code/mummys-food-front/src/pages/Register.jsx
import React from "react";
import RegistrationForm from "../components/RegistrationForm";

const Register = () => (
  <div>
    <h1>Register</h1>
    <RegistrationForm />
  </div>
);

export default Register;


// File: /Users/zainfrayha/Desktop/Code/mummys-food-front/src/reportWebVitals.js
const reportWebVitals = onPerfEntry => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;


// File: /Users/zainfrayha/Desktop/Code/mummys-food-front/src/utils/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("token");

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;


// File: /Users/zainfrayha/Desktop/Code/mummys-food-front/src/utils/api.jsx
// utils/api.js
import axios from "axios";
import config from "../config";

const api = axios.create({
  baseURL: config.apiBaseUrl,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

