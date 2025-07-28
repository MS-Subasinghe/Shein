// ClothesDisplay.jsx
import React, { useEffect, useState } from 'react';

const ClothesDisplay = ({ onCartUpdate }) => {
  const [clothes, setClothes] = useState([]);
  const [addedToCartId, setAddedToCartId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [hoveredItem, setHoveredItem] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [itemLoading, setItemLoading] = useState(false);

  // For demo purposes, using a fixed userId. In a real app, this would come from authentication
  const userId = "user123";

  useEffect(() => {
    const fetchClothes = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/clothes');
        if (!response.ok) {
          throw new Error('Failed to fetch clothes');
        }
        const data = await response.json();
        setClothes(data);
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchClothes();
  }, []);

  // Fetch cart count on component mount
  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/cart/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setCartCount(data.totalItems || 0);
          if (onCartUpdate) onCartUpdate(data.totalItems || 0);
        }
      } catch (err) {
        console.error('Error fetching cart:', err);
      }
    };

    fetchCartCount();
  }, [userId, onCartUpdate]);

  const handleQuickView = async (itemId) => {
    setItemLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/clothes/${itemId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch item details');
      }
      const itemDetails = await response.json();
      setSelectedItem(itemDetails);
    } catch (err) {
      console.error('Error fetching item details:', err);
      alert('Failed to load item details');
    } finally {
      setItemLoading(false);
    }
  };

  const handleAddToCart = async (item) => {
    try {
      const response = await fetch(`http://localhost:5000/api/cart/${userId}/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clothesId: item._id,
          quantity: 1
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add item to cart');
      }

      const data = await response.json();
      setCartCount(data.totalItems);
      if (onCartUpdate) onCartUpdate(data.totalItems);
      
      // Show success feedback
      setAddedToCartId(item._id);
      setTimeout(() => setAddedToCartId(null), 2000);
      
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('Failed to add item to cart');
    }
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  // Get unique categories
  const categories = ['All', ...new Set(clothes.map(item => item.category).filter(Boolean))];

  // Filter clothes by category
  const filteredClothes = selectedCategory === 'All' 
    ? clothes 
    : clothes.filter(item => item.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mb-4"></div>
          <p className="text-white text-xl">Loading fashion collection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white py-16 border-b border-gray-700">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4 animate-fade-in bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
            Fashion Collection
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Discover our latest trendy collection
          </p>
          
          {/* Cart Counter */}
          {cartCount > 0 && (
            <div className="mb-6">
              <div className="inline-flex items-center bg-gray-800 rounded-full px-4 py-2 border border-gray-600">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 7.5M7 13l1.5-7.5M16 21a2 2 0 100-4 2 2 0 000 4zm-7 0a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
                <span className="text-white font-medium">
                  Cart: {cartCount} items
                </span>
              </div>
            </div>
          )}
          
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 border ${
                  selectedCategory === category
                    ? 'bg-white text-black shadow-lg border-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border-gray-600 hover:border-gray-500'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredClothes.map((item, index) => (
            <div
              key={item._id}
              className="group bg-gray-800 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-700 hover:border-gray-600"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: 'fadeInUp 0.6s ease-out forwards'
              }}
              onMouseEnter={() => setHoveredItem(item._id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {/* Image Container */}
              <div className="relative overflow-hidden">
                <img
                  src={item.imageUrl || 'https://via.placeholder.com/300x400?text=No+Image'}
                  alt={item.name}
                  className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Overlay on hover */}
                <div className={`absolute inset-0 bg-black bg-opacity-60 transition-opacity duration-300 ${
                  hoveredItem === item._id ? 'opacity-100' : 'opacity-0'
                }`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      onClick={() => handleQuickView(item._id)}
                      disabled={itemLoading}
                      className="text-white text-center hover:scale-110 transition-transform duration-200"
                    >
                      <div className="bg-gray-800 bg-opacity-80 rounded-full p-3 mb-2 border border-gray-600 hover:border-white">
                        {itemLoading ? (
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        ) : (
                          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"/>
                          </svg>
                        )}
                      </div>
                      <p className="text-sm font-medium">Quick View</p>
                    </button>
                  </div>
                </div>

                {/* New Badge */}
                {new Date() - new Date(item.createdAt) < 7 * 24 * 60 * 60 * 1000 && (
                  <div className="absolute top-3 left-3 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold border border-green-500">
                    NEW
                  </div>
                )}

                {/* Category Badge */}
                {item.category && (
                  <div className="absolute top-3 right-3 bg-gray-700 text-gray-200 px-3 py-1 rounded-full text-xs font-medium border border-gray-600">
                    {item.category}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Brand */}
                {item.brand && (
                  <p className="text-sm text-gray-400 font-medium mb-1 uppercase tracking-wide">
                    {item.brand}
                  </p>
                )}

                {/* Name */}
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-gray-300 transition-colors duration-300">
                  {item.name}
                </h3>

                {/* Description */}
                {item.description && (
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {item.description}
                  </p>
                )}

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-white">
                      Rs. {item.price?.toLocaleString()}
                    </span>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <span className="text-sm text-gray-500 line-through">
                        Rs. {item.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Available Sizes */}
                {item.sizes && item.sizes.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-400 mb-1">Available Sizes:</p>
                    <div className="flex flex-wrap gap-1">
                      {item.sizes.slice(0, 4).map((size, idx) => (
                        <span key={idx} className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs border border-gray-600">
                          {size}
                        </span>
                      ))}
                      {item.sizes.length > 4 && (
                        <span className="text-gray-400 text-xs">+{item.sizes.length - 4} more</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Add to Cart Button */}
                <button
                  onClick={() => handleAddToCart(item)}
                  className={`w-full font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-600 shadow-lg border ${
                    addedToCartId === item._id
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-gradient-to-r from-gray-700 to-gray-900 text-white hover:from-gray-600 hover:to-gray-800 border-gray-600 hover:border-gray-500'
                  }`}
                >
                  {addedToCartId === item._id ? '✓ Added!' : 'Add to Cart'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredClothes.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="text-gray-600 mb-4">
              <svg className="w-24 h-24 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2L3 7v11a2 2 0 002 2h10a2 2 0 002-2V7l-7-5zM6 9h8v8H6V9z"/>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-300 mb-2">No items found</h3>
            <p className="text-gray-500">Try selecting a different category</p>
          </div>
        )}
      </div>

      {/* Product Details Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50" onClick={closeModal}>
          <div className="bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
                <h2 className="text-2xl font-bold text-white">Product Details</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-white transition-colors duration-200 p-2 hover:bg-gray-700 rounded-full"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Product Image */}
                <div className="relative">
                  <img
                    src={selectedItem.imageUrl || 'https://via.placeholder.com/500x600?text=No+Image'}
                    alt={selectedItem.name}
                    className="w-full h-96 object-cover rounded-xl border border-gray-600"
                  />
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {new Date() - new Date(selectedItem.createdAt) < 7 * 24 * 60 * 60 * 1000 && (
                      <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold border border-green-500">
                        NEW
                      </div>
                    )}
                    {selectedItem.category && (
                      <div className="bg-gray-700 text-gray-200 px-3 py-1 rounded-full text-sm font-medium border border-gray-600">
                        {selectedItem.category}
                      </div>
                    )}
                  </div>
                </div>

                {/* Product Info */}
                <div className="space-y-6">
                  {/* Brand */}
                  {selectedItem.brand && (
                    <p className="text-gray-400 font-medium uppercase tracking-wide">
                      {selectedItem.brand}
                    </p>
                  )}

                  {/* Product Name */}
                  <h1 className="text-3xl font-bold text-white">
                    {selectedItem.name}
                  </h1>

                  {/* Price */}
                  <div className="text-3xl font-bold text-white">
                    Rs. {selectedItem.price?.toLocaleString()}
                  </div>

                  {/* Description */}
                  {selectedItem.description && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
                      <p className="text-gray-300 leading-relaxed">
                        {selectedItem.description}
                      </p>
                    </div>
                  )}

                  {/* Sizes */}
                  {selectedItem.sizes && selectedItem.sizes.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Available Sizes</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedItem.sizes.map((size, index) => (
                          <button
                            key={index}
                            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg border border-gray-600 hover:border-gray-500 transition-all duration-200"
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Colors */}
                  {selectedItem.colors && selectedItem.colors.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Available Colors</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedItem.colors.map((color, index) => (
                          <button
                            key={index}
                            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg border border-gray-600 hover:border-gray-500 transition-all duration-200"
                          >
                            {color}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Created Date */}
                  <div className="text-sm text-gray-400">
                    Added on: {new Date(selectedItem.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>

                  {/* Add to Cart Button */}
                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={() => {
                        handleAddToCart(selectedItem);
                        closeModal();
                      }}
                      className="flex-1 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 text-white font-bold py-4 px-8 rounded-xl transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-600 shadow-lg border border-gray-600 hover:border-gray-500"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={closeModal}
                      className="px-8 py-4 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-xl transition-all duration-200 border border-gray-600 hover:border-gray-500"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-fade-in {
          animation: fadeIn 1s ease-out;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default ClothesDisplay;