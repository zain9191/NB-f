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
