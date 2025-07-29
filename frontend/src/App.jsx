import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import AdminPanel from './pages/AdminPanel';
import Shop from './pages/Shop';
import CartPage from './components/CartPage';

function App() {
  const [cartCount, setCartCount] = useState(0);
  const userId = "user123";

  // Fetch initial cart count when app loads
  useEffect(() => {
    fetchCartCount();
  }, []);

  const fetchCartCount = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/cart/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setCartCount(data.totalItems || 0);
      }
    } catch (err) {
      console.error('Error fetching cart count:', err);
    }
  };

  // Function to update cart count from any component
  const updateCartCount = (newCount) => {
    setCartCount(newCount);
  };

  return (
    <>
      <Navbar cartCount={cartCount} updateCartCount={updateCartCount} />
      <div style={{ paddingTop: '80px' }}> {/* Account for fixed navbar */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
          <Route 
            path='/shop' 
            element={<Shop onCartUpdate={updateCartCount} />}
          />
          <Route path='/admin' element={<AdminPanel />} />
          <Route 
            path='/cart' 
            element={<CartPage onCartUpdate={updateCartCount} />} 
          />
        </Routes>
      </div>
    </>
  );
}

export default App;
