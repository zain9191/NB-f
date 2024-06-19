
// File: /Users/zainfrayha/Desktop/Code/mummys-food-front/src/App.js
// File: /src/App.js
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
import AuthProvider from './contexts/AuthContext';
import MealForm from './components/MealForm';
import MealsList from './components/MealsList';

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
        const response = await axios.get("/api/food");
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
  <footer>
    <p>&copy; 2024 Food Selling Platform</p>
  </footer>
);

export default Footer;


// File: /Users/zainfrayha/Desktop/Code/mummys-food-front/src/components/Header.jsx
// File: /src/components/Header.jsx
import React from "react";
import { Link } from "react-router-dom";

const Header = () => (
  <header>
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/register">Register</Link>
        </li>
        <li>
          <Link to="/profile">Profile</Link>
        </li>
        <li>
          <Link to="/meals">Meals</Link>
        </li>
        <li>
          <Link to="/create-meal">Create Meal</Link>
        </li>
      </ul>
    </nav>
  </header>
);

export default Header;


// File: /Users/zainfrayha/Desktop/Code/mummys-food-front/src/components/LoginForm.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check for token on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // console.log("Submitting form data:", formData); // Debugging line
    try {
      const response = await axios.post(
        "http://localhost:5080/api/users/login",
        formData
      );

      // console.log("Login response:", response); // Debugging line

      if (response.data && response.data.token) {
        const token = response.data.token;
        localStorage.setItem("token", token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        // console.log("Token stored:", token); // Debugging line
        alert("Login successful!");
        navigate("/profile");
      } else {
        setError("Failed to retrieve token.");
        console.error("Token not found in response data:", response.data);
      }
    } catch (error) {
      setError("Invalid credentials, please try again.");
      if (error.response) {
        // console.error("Login error response:", error.response.data); // Debugging line
      } else {
        // console.error("Login error message:", error.message); // Debugging line
      }
    } finally {
      setLoading(false);
      // console.log("Loading state set to false"); // Debugging line
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


// File: /Users/zainfrayha/Desktop/Code/mummys-food-front/src/components/MealsList.jsx
// File: /components/MealsList.jsx
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { CartContext } from "../contexts/CartContext";

const MealsList = () => {
  const [meals, setMeals] = useState([]);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/meals");
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
            <button onClick={() => addToCart(meal)}>Add to Cart</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MealsList;


// File: /Users/zainfrayha/Desktop/Code/mummys-food-front/src/components/Profile.jsx
// File: /Users/zainfrayha/Desktop/Code/mummys-food-front/src/components/Profile.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddressForm from "./AddressForm";
import api from "../utils/api"; // Ensure the path is correct

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await api.get("/api/profile");

        setProfile(response.data);
        setAddresses(response.data.addresses || []);
      } catch (error) {
        console.error("Error fetching profile:", error);
        if (error.response && error.response.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const addAddress = async (address) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.post("/api/address/add", address, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAddresses(response.data.addresses);
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

      setProfile(response.data);
    } catch (error) {
      console.error("Error setting active address:", error);
    }
  };

  const deleteAddress = async (addressId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.delete(`/api/address/delete/${addressId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAddresses(response.data.addresses);
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return <div>Profile data could not be loaded.</div>;
  }

  return (
    <div>
      <h1>{profile.name}</h1>
      <p>Email: {profile.email}</p>
      <p>Phone: {profile.phone}</p>
      <p>ZipCode: {profile.zipCode}</p>

      <h2>Addresses</h2>
      <ul>
        {addresses.map((address) => (
          <li key={address._id}>
            {address.addressLine}, {address.city}, {address.state},{" "}
            {address.zipCode}, {address.country}
            <button onClick={() => setActiveAddress(address._id)}>
              {profile.activeAddress &&
              profile.activeAddress._id === address._id
                ? "Active"
                : "Set Active"}
            </button>
            <button onClick={() => deleteAddress(address._id)}>Delete</button>
          </li>
        ))}
      </ul>
      <AddressForm addAddress={addAddress} />
    </div>
  );
};

export default Profile;


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

      console.log("Server response:", response.data);

      if (response.data && response.data.token) {
        const token = response.data.token;
        localStorage.setItem("token", token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        console.log("Token saved to local storage:", token);
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


// File: /Users/zainfrayha/Desktop/Code/mummys-food-front/src/contexts/AuthContext.jsx
// File: /contexts/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (localStorage.getItem("token")) {
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${localStorage.getItem("token")}`;
        try {
          const response = await axios.get("/api/profile");
          setUser(response.data);
        } catch (error) {
          console.error("Failed to load user", error);
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post("/api/users/login", {
        email,
        password,
      });
      localStorage.setItem("token", response.data.token);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.token}`;
      setUser(response.data.user);
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;


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
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5080", // Ensure this matches your backend URL
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

