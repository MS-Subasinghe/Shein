import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CartPage = ({ onCartUpdate }) => {
  const [cart, setCart] = useState({ items: [] });
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deliveryFee] = useState(500);
  const [discount, setDiscount] = useState(0);

  const userId = 'user123'; // replace with real user ID or auth

  // Convert localStorage cart array to cart object used by React state
  const buildCartFromLocalStorage = (localCart) => {
    const cartObj = {
      items: localCart.map(item => ({
        _id: item.clothesId,
        clothesId: {
          _id: item.clothesId,
          name: item.name,
          price: item.price,
          imageUrl: item.imageUrl,
        },
        quantity: item.quantity,
      })),
    };
    const total = localCart.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const count = localCart.reduce((sum, i) => sum + i.quantity, 0);
    return { cartObj, total, count };
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/cart/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setCart(data.cart || { items: [] });
        setTotalPrice(data.totalPrice || 0);
        setTotalItems(data.totalItems || 0);
        if (onCartUpdate) onCartUpdate(data.totalItems || 0);
      } else {
        // fallback localStorage cart
        const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
        if (localCart.length > 0) {
          const { cartObj, total, count } = buildCartFromLocalStorage(localCart);
          setCart(cartObj);
          setTotalPrice(total);
          setTotalItems(count);
          if (onCartUpdate) onCartUpdate(count);
        }
        toast.error('Failed to fetch cart from server, loaded local cart');
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
      // fallback localStorage cart on error
      const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
      if (localCart.length > 0) {
        const { cartObj, total, count } = buildCartFromLocalStorage(localCart);
        setCart(cartObj);
        setTotalPrice(total);
        setTotalItems(count);
        if (onCartUpdate) onCartUpdate(count);
      }
      toast.error('Error fetching cart, loaded local cart');
    } finally {
      setLoading(false);
    }
  };

  // Update quantity fallback in localStorage
  const updateQuantityLocal = (clothesId, newQuantity) => {
    if (newQuantity < 1) return;

    let localCart = JSON.parse(localStorage.getItem('cart') || '[]');
    localCart = localCart.map(item =>
      item.clothesId === clothesId ? { ...item, quantity: newQuantity } : item
    );
    localStorage.setItem('cart', JSON.stringify(localCart));

    const { cartObj, total, count } = buildCartFromLocalStorage(localCart);
    setCart(cartObj);
    setTotalPrice(total);
    setTotalItems(count);
    if (onCartUpdate) onCartUpdate(count);
  };

  const updateQuantity = async (clothesId, newQuantity) => {
    if (newQuantity < 1) return;
    setUpdating(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/cart/${userId}/update/${clothesId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quantity: newQuantity }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        setCart(data.cart || { items: [] });
        setTotalPrice(data.totalPrice || 0);
        setTotalItems(data.totalItems || 0);
        if (onCartUpdate) onCartUpdate(data.totalItems || 0);
        toast.success('Quantity updated successfully');
      } else {
        throw new Error('Failed to update quantity on server');
      }
    } catch (err) {
      console.error('Error updating quantity on server:', err);
      toast.error('Failed to update quantity on server, updated locally');
      updateQuantityLocal(clothesId, newQuantity);
    } finally {
      setUpdating(false);
    }
  };

  // Remove fallback in localStorage
  const removeFromCartLocal = (clothesId) => {
    let localCart = JSON.parse(localStorage.getItem('cart') || '[]');
    localCart = localCart.filter(item => item.clothesId !== clothesId);
    localStorage.setItem('cart', JSON.stringify(localCart));

    const { cartObj, total, count } = buildCartFromLocalStorage(localCart);
    setCart(cartObj);
    setTotalPrice(total);
    setTotalItems(count);
    if (onCartUpdate) onCartUpdate(count);
  };

  const removeFromCart = async (clothesId) => {
    setUpdating(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/cart/${userId}/remove/${clothesId}`,
        { method: 'DELETE' }
      );
      if (response.ok) {
        const data = await response.json();
        setCart(data.cart || { items: [] });
        setTotalPrice(data.totalPrice || 0);
        setTotalItems(data.totalItems || 0);
        if (onCartUpdate) onCartUpdate(data.totalItems || 0);
        toast.success('Item removed successfully');
      } else {
        throw new Error('Failed to remove item on server');
      }
    } catch (err) {
      console.error('Error removing item on server:', err);
      toast.error('Failed to remove item on server, removed locally');
      removeFromCartLocal(clothesId);
    } finally {
      setUpdating(false);
    }
  };

  const clearCartLocal = () => {
    localStorage.removeItem('cart');
    setCart({ items: [] });
    setTotalPrice(0);
    setTotalItems(0);
    if (onCartUpdate) onCartUpdate(0);
  };

  const clearCart = async () => {
    if (!window.confirm('Are you sure you want to clear your cart?')) return;
    setUpdating(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/cart/${userId}/clear`,
        { method: 'POST' }
      );
      if (response.ok) {
        const data = await response.json();
        setCart(data.cart || { items: [] });
        setTotalPrice(data.totalPrice || 0);
        setTotalItems(data.totalItems || 0);
        if (onCartUpdate) onCartUpdate(data.totalItems || 0);
        localStorage.removeItem('cart'); // clear localStorage too
        toast.success('Cart cleared successfully');
      } else {
        throw new Error('Failed to clear cart on server');
      }
    } catch (err) {
      console.error('Error clearing cart on server:', err);
      toast.error('Failed to clear cart on server, cleared locally');
      clearCartLocal();
    } finally {
      setUpdating(false);
    }
  };

  const subtotal = totalPrice;
  const finalTotal = subtotal + deliveryFee - discount;

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
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <Link
              to="/shop"
              className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Continue Shopping
            </Link>
          </div>

          {cart.items.length > 0 ? (
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
                        className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50 flex items-center"
                      >
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Clear Cart
                      </button>
                    </div>
                  </div>

                  <ul className="divide-y divide-gray-200">
                    {cart.items.map((item) => (
                      <li key={item.clothesId._id} className="px-6 py-6">
                        <div className="flex items-center">
                          {/* Product Image */}
                          <div className="flex-shrink-0 w-24 h-24">
                            <img
                              className="w-full h-full object-cover rounded-lg border border-gray-200"
                              src={
                                item.clothesId?.imageUrl ||
                                'https://via.placeholder.com/100x100?text=No+Image'
                              }
                              alt={item.clothesId?.name || 'Product'}
                            />
                          </div>

                          {/* Product Details */}
                          <div className="ml-6 flex-1">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="text-lg font-medium text-gray-900">
                                  {item.clothesId?.name || 'Unknown Product'}
                                </h3>

                                <div className="mt-2 flex items-center space-x-4">
                                  <p className="text-lg font-semibold text-gray-900">
                                    Rs. {item.clothesId?.price?.toLocaleString() || '0'}
                                  </p>
                                  <span className="text-gray-400">×</span>
                                  <span className="text-gray-600">{item.quantity}</span>
                                  <span className="text-gray-400">=</span>
                                  <p className="text-lg font-bold text-indigo-600">
                                    Rs.{' '}
                                    {(
                                      (item.clothesId?.price || 0) * item.quantity
                                    ).toLocaleString()}
                                  </p>
                                </div>
                              </div>

                              {/* Remove Button */}
                              <button
                                onClick={() => removeFromCart(item.clothesId._id)}
                                disabled={updating}
                                className="text-red-600 hover:text-red-800 disabled:opacity-50 p-2 hover:bg-red-50 rounded-full transition-colors"
                                title="Remove item"
                              >
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </button>
                            </div>

                            {/* Quantity Controls */}
                            <div className="mt-4 flex items-center space-x-2">
                              <span className="text-sm text-gray-600">Quantity:</span>
                              <div className="flex items-center border border-gray-300 rounded-md">
                                <button
                                  onClick={() =>
                                    updateQuantity(item.clothesId._id, item.quantity - 1)
                                  }
                                  disabled={updating || item.quantity <= 1}
                                  className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                  -
                                </button>
                                <span className="px-4 py-1 text-lg font-medium border-x border-gray-300 bg-gray-50">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    updateQuantity(item.clothesId._id, item.quantity + 1)
                                  }
                                  disabled={updating}
                                  className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50 transition-colors"
                                >
                                  +
                                </button>
                              </div>
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
                <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                  <h2 className="text-lg font-medium text-gray-900 mb-6">Order Summary</h2>

                  {/* Cost Breakdown */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal ({totalItems} items):</span>
                      <span className="font-medium">Rs. {subtotal.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Delivery Fee:</span>
                      <span className="font-medium">Rs. {deliveryFee.toLocaleString()}</span>
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Discount:</span>
                        <span>-Rs. {discount.toLocaleString()}</span>
                      </div>
                    )}

                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span className="text-indigo-600">Rs. {finalTotal.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Estimated Delivery */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="flex items-center text-sm text-gray-600">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h4a2 2 0 012 2v1m-6 0h8m-8 0H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2m-8 0V7"
                        />
                      </svg>
                      <span>Estimated delivery: 3-5 business days</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      disabled={updating || totalItems === 0}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                    >
                      {updating ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                            />
                          </svg>
                          Proceed to Checkout
                        </>
                      )}
                    </button>

                    <Link
                      to="/shop"
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Your cart is empty.</h2>
              <Link
                to="/shop"
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Go to Shop &rarr;
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartPage;
