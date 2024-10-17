// src/App.js
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer';
import PrivateRoute from './utils/PrivateRoute';
import CartProvider from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';

// Import ErrorProvider and Notifications
import { ErrorProvider } from './contexts/ErrorContext';
import Notifications from './components/Notifications/Notifications';

// Lazy-loaded components for code splitting
const Home = lazy(() => import('./pages/Home/Home'));
const Register = lazy(() => import('./pages/Register'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const Login = lazy(() => import('./pages/Login'));
const MealsList = lazy(() => import('./components/MealsList/MealsList'));
const NotFound = lazy(() => import('./pages/NotFound'));
const CartPage = lazy(() => import('./pages/CartPage/CartPage'));
const MealForm = lazy(() => import('./components/MealForm/MealForm')); // Ensure correct path
const MealDetailPage = lazy(() => import('./pages/MealDetailPage/MealDetailPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage/SettingsPage'));

const App = () => (
  <AuthProvider>
    <CartProvider>
      <ErrorProvider>
        <Router>
          <Header />
          {/* Notifications component to display error and success messages */}
          <Notifications />
          <main>
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/meals" element={<MealsList />} />
                <Route path="/meals/:id" element={<MealDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="*" element={<NotFound />} />

                {/* Protected Routes */}
                <Route
                  path="/profile"
                  element={
                    <PrivateRoute>
                      <ProfilePage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <PrivateRoute>
                      <SettingsPage />
                    </PrivateRoute>
                  }
                />

                {/* Consolidated Meal Form Route for Creating and Editing */}
                <Route
                  path="/meal-form/:mealId?"
                  element={
                    <PrivateRoute>
                      <MealForm />
                    </PrivateRoute>
                  }
                />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </Router>
      </ErrorProvider>
    </CartProvider>
  </AuthProvider>
);

export default App;
