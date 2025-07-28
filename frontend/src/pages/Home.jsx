import React from 'react'
import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import FooterDarkSocial from '../components/Footer'
import FooterMultiColumn from '../components/Footer'

// New Arrivals Component
const NewArrivals = () => {
  const [products, setProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  // Fetch clothes from API
  React.useEffect(() => {
    const fetchClothes = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/clothes'); // Your API endpoint
        
        if (!response.ok) {
          throw new Error('Failed to fetch clothes');
        }
        
        const data = await response.json();
        
        // Get only the latest 4 items (assuming newer items have recent createdAt or sort by _id)
        const latestItems = data
          .sort((a, b) => new Date(b.createdAt || b._id) - new Date(a.createdAt || a._id))
          .slice(0, 4);
        
        setProducts(latestItems);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching clothes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchClothes();
  }, []);

  // Loading state
  if (loading) {
    // Handle add to cart functionality
  const handleAddToCart = async (product) => {
    try {
      // You can implement cart API call here
      // Example:
      // const response = await fetch('http://localhost:5000/api/cart', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('token')}` // if auth required
      //   },
      //   body: JSON.stringify({
      //     productId: product._id,
      //     quantity: 1
      //   })
      // });
      
      // For now, just show alert
      alert(`${product.name || product.title} added to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart');
    }
  };

  return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">New Arrivals</h2>
            <p className="text-gray-600">Loading latest products...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="w-full h-64 bg-gray-300"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">New Arrivals</h2>
            <p className="text-red-600">Error loading products: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">New Arrivals</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our latest collection of premium products, carefully selected for quality and innovation
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative">
                <img 
                  src={product.imageUrl || product.image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=300&fit=crop'} 
                  alt={product.name || product.title}
                  className="w-full h-64 object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=300&fit=crop';
                  }}
                />
                <span className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded">
                  NEW
                </span>
                {product.discount && (
                  <span className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 text-xs font-semibold rounded">
                    -{product.discount}%
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {product.name || product.title}
                </h3>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xl font-bold text-blue-600">
                    ${product.price?.toFixed(2) || '0.00'}
                  </p>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <p className="text-sm text-gray-500 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </p>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {product.category} • {product.size || 'Various sizes'}
                </p>
                <button 
                  className="w-full mt-3 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                  onClick={() => handleAddToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Client Ratings Component
const ClientRatings = () => {
  const reviews = [
    {
      id: 1,
      name: "Sarah Johnson",
      rating: 5,
      comment: "Excellent quality products and fast shipping. Highly recommend!",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face"
    },
    {
      id: 2,
      name: "Mike Chen",
      rating: 5,
      comment: "Great customer service and amazing product selection.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face"
    },
    {
      id: 3,
      name: "Emily Davis",
      rating: 4,
      comment: "Love shopping here! Always find what I'm looking for.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face"
    }
  ]

  const StarRating = ({ rating }) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    )
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
          <p className="text-gray-600">Trusted by thousands of satisfied customers worldwide</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div key={review.id} className="bg-gray-50 rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <img 
                  src={review.avatar} 
                  alt={review.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{review.name}</h4>
                  <StarRating rating={review.rating} />
                </div>
              </div>
              <p className="text-gray-600 italic">"{review.comment}"</p>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">4.8</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">2,500+</div>
              <div className="text-sm text-gray-600">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">99%</div>
              <div className="text-sm text-gray-600">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Offer Banners Component
const OfferBanners = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Main Offer Banner */}
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Summer Sale</h3>
                <p className="text-gray-600 mb-4">Up to 50% off on selected items</p>
                <button className="bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors">
                  Shop Now
                </button>
              </div>
              <div className="text-right">
                <span className="text-4xl font-bold text-red-500">50%</span>
                <p className="text-sm text-gray-600">OFF</p>
              </div>
            </div>
          </div>
          
          {/* Secondary Offer Banner */}
          <div className="bg-gradient-to-r from-orange-400 to-pink-500 rounded-lg p-8 text-white shadow-lg">
            <h3 className="text-2xl font-bold mb-2">Free Shipping</h3>
            <p className="mb-4">On orders over $99</p>
            <div className="flex items-center">
              <svg className="w-8 h-8 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z" />
              </svg>
              <span className="font-semibold">Fast & Reliable Delivery</span>
            </div>
          </div>
        </div>
        
        {/* Additional Promotional Banners */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-green-500 text-white rounded-lg p-6 text-center">
            <svg className="w-12 h-12 mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <h4 className="font-bold mb-1">Quality Guarantee</h4>
            <p className="text-sm">30-day money back</p>
          </div>
          
          <div className="bg-blue-500 text-white rounded-lg p-6 text-center">
            <svg className="w-12 h-12 mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            <h4 className="font-bold mb-1">24/7 Support</h4>
            <p className="text-sm">Always here to help</p>
          </div>
          
          <div className="bg-purple-500 text-white rounded-lg p-6 text-center">
            <svg className="w-12 h-12 mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
              <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
            </svg>
            <h4 className="font-bold mb-1">Secure Payment</h4>
            <p className="text-sm">Protected transactions</p>
          </div>
        </div>
      </div>
    </section>
  )
}

const Home = () => {
  return (
    <>
      <Navbar />
      <HeroSection />
      <NewArrivals />
      <ClientRatings />
      <OfferBanners />
      <FooterMultiColumn/>
    </>
  )
}

export default Home