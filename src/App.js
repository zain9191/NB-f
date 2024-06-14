import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Register from './pages/Register';
import ProfilePage from './pages/ProfilePage';
import FoodListPage from './pages/FoodListPage';
import CartProvider from './contexts/CartContext';

const App = () => (
  <CartProvider>
    <Router>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/food-list" element={<FoodListPage />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  </CartProvider>
);

export default App;
