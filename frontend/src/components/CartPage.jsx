// CartPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CartPage = ({ onCartUpdate }) => {
  const [cart, setCart] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // For demo purposes, using a fixed userId. In a real app, this would come from authentication
  const userId = "user123";

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/cart/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }
      const data = await response.json();
      setCart(data.cart);
      setTotalPrice(data.totalPrice);
      setTotalItems(data.totalItems);
      if (onCartUpdate) onCartUpdate(data.totalItems);
    } catch (err) {
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (clothesId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setUpdating(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/cart/${userId}/update/${clothesId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ quantity: newQuantity })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update quantity');
      }

      const data = await response.json();
      setCart(data.cart);
      setTotalPrice(data.totalPrice);
      setTotalItems(data.totalItems);
      if (onCartUpdate) onCartUpdate(data.totalItems);
    } catch (err) {
      console.error('Error updating quantity:', err);
      alert('Failed to update quantity');
    } finally {
      setUpdating(false);
    }
  };

  const removeFromCart = async (clothesId) => {
    setUpdating(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/cart/${userId}/remove/${clothesId}`,
        {
          method: 'DELETE'
        }
      );

      if (!response.ok) {
        throw new Error('Failed to remove item');
      }

      const data = await response.json();
      setCart(data.cart);
      setTotalPrice(data.totalPrice);
      setTotalItems(data.totalItems);
      if (onCartUpdate) onCartUpdate(data.totalItems);
    } catch (err) {
      console.error('Error removing item:', err);
      alert('Failed to remove item');
    } finally {
      setUpdating(false);
    }
  };

  const clearCart = async () => {
    if (!confirm('Are you sure you want to clear your cart?')) return;
    
    setUpdating(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/cart/${userId}/clear`,
        {
          method: 'POST'
        }
      );

      if (!response.ok) {
        throw new Error('Failed to clear cart');
      }

      const data = await response.json();
      setCart(data.cart);
      setTotalPrice(data.totalPrice);
      setTotalItems(data.totalItems);
      if (onCartUpdate) onCartUpdate(data.totalItems);
    } catch (err) {
      console.error('Error clearing cart:', err);
      alert('Failed to clear cart');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-gray-600 text-xl">Loading cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <Link
            to="/shop"
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Continue Shopping
          </Link>
        </div>

        {cart && cart.items && cart.items.length > 0 ? (
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
            {/* Cart Items */}
            <div className="lg:col-span-8">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium text-gray-900">
                      Cart Items ({totalItems})
                    </h2>
                    <button
                      onClick={clearCart}
                      disabled={updating}
                      className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
                    >
                      Clear Cart
                    </button>
                  </div>
                </div>

                <ul className="divide-y divide-gray-200">
                  {cart.items.map((item) => (
                    <li key={item._id} className="px-6 py-6">
                      <div className="flex items-center">
                        {/* Product Image */}
                        <div className="flex-shrink-0 w-24 h-24">
                          <img
                            className="w-full h-full object-cover rounded-lg"
                            src={item.clothesId?.imageUrl || 'https://via.placeholder.com/100x100?text=No+Image'}
                            alt={item.clothesId?.name || 'Product'}
                          />
                        </div>

                        {/* Product Details */}
                        <div className="ml-6 flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">
                                {item.clothesId?.name || 'Unknown Product'}
                              </h3>
                              {item.clothesId?.brand && (
                                <p className="text-sm text-gray-500 uppercase tracking-wide">
                                  {item.clothesId.brand}
                                </p>
                              )}
                              {item.clothesId?.category && (
                                <p className="text-sm text-gray-500">
                                  Category: {item.clothesId.category}
                                </p>
                              )}
                              <p className="text-lg font-semibold text-gray-900 mt-2">
                                Rs. {item.clothesId?.price?.toLocaleString() || '0'}
                              </p>
                            </div>

                            {/* Remove Button */}
                            <button
                              onClick={() => removeFromCart(item.clothesId._id)}
                              disabled={updating}
                              className="text-red-600 hover:text-red-800 disabled:opacity-50"
                              title="Remove item"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-6 6-6-6" />
                              </svg>
                            </button>
                          </div>

                          {/* Quantity Controls */}
                          <div className="mt-4 flex items-center space-x-4">
                            <button
                              onClick={() => updateQuantity(item.clothesId._id, item.quantity - 1)}
                              disabled={updating || item.quantity <= 1}
                              className="px-3 py-1 border rounded disabled:opacity-50"
                            >
                              -
                            </button>
                            <span className="text-lg">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.clothesId._id, item.quantity + 1)}
                              disabled={updating}
                              className="px-3 py-1 border rounded"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4 mt-10 lg:mt-0">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
                <div className="flex justify-between mb-2">
                  <span>Total Items:</span>
                  <span>{totalItems}</span>
                </div>
                <div className="flex justify-between mb-6">
                  <span>Total Price:</span>
                  <span className="font-bold">Rs. {totalPrice.toLocaleString()}</span>
                </div>
                <button
                  disabled={updating}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded disabled:opacity-50"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600 text-lg">Your cart is empty.</p>
            <Link
              to="/shop"
              className="mt-4 inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded"
            >
              Shop Now
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
