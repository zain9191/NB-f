// File: src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer';
import Home from './pages/Home/Home';
import Register from './pages/Register';
import ProfilePage from './pages/ProfilePage';
import Login from './pages/Login';
import PrivateRoute from './utils/PrivateRoute';
import CartProvider from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import MealsList from './components/MealsList';
import NotFound from './pages/NotFound';
import CartPage from './pages/CartPage/CartPage';
import MealForm from './components/MealForm/MealForm';
import MealDetailPage from './pages/MealDetailPage/MealDetailPage';
import EditMealForm from './components/EditMealForm';
import SettingsPage from './pages/SettingsPage/SettingsPage'; 

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
            <Route
              path="/add-meal"
              element={
                <PrivateRoute>
                  <MealForm />
                </PrivateRoute>
              }
            />
            <Route path="/meals" element={<MealsList />} />
            <Route path="/meals/:id" element={<MealDetailPage />} />
            <Route
              path="/edit-meal/:id"
              element={
                <PrivateRoute>
                  <EditMealForm />
                </PrivateRoute>
              }
            />
            <Route path="/cart" element={<CartPage />} />
            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <SettingsPage />
                </PrivateRoute>
              }
            /> {/* Added the Settings route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </CartProvider>
  </AuthProvider>
);

export default App;
