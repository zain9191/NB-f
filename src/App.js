import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './Pages/Home';
import Register from './Pages/Register';
import ProfilePage from './Pages/ProfilePage';
import FoodListPage from './Pages/FoodListPage';



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
