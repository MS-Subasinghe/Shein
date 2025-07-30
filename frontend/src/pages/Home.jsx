import React, { useState, useEffect, useRef } from 'react'
import FooterMultiColumn from '../components/Footer'

// Intersection Observer Hook for scroll animations
const useInView = (threshold = 0.1) => {
  const [isInView, setIsInView] = useState(false)
  const ref = useRef()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
      },
      { threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold])

  return [ref, isInView]
}

// Animated Hero Section
const HeroSection = ({
  title = "Your Favorite Clothing Store, Delivered Fast & Stylish.",
  subtitle = "Discover the latest trends and timeless styles in our extensive collection. Shop now and step up your fashion game!",
  buttonText = "Shop Now",
  buttonLink = "/shop",
  backgroundImage = "https://images.pexels.com/photos/135620/pexels-photo-135620.jpeg"
}) => {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <section
      className="relative w-full min-h-screen flex items-center justify-center px-6 text-center text-white overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className={`absolute inset-0 bg-black transition-opacity duration-1000 ${isLoaded ? 'opacity-50' : 'opacity-80'}`}></div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white opacity-20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      <div className="relative max-w-4xl">
        <h1 className={`text-4xl md:text-6xl font-extrabold mb-6 drop-shadow-lg transform transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          {title}
        </h1>
        
        <p className={`text-lg md:text-xl mb-8 drop-shadow-md transform transition-all duration-1000 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          {subtitle}
        </p>
        
        <div className={`transform transition-all duration-1000 delay-500 ${isLoaded ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'}`}>
          <a
            href={buttonLink}
            className="group inline-block bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold px-8 py-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 transition-all duration-700 group-hover:translate-x-full"></div>
            <span className="relative z-10 flex items-center justify-center">
              {buttonText}
              <svg className="ml-2 w-5 h-5 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}

// New Arrivals Component WITHOUT Animations
const NewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClothes = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Attempting to fetch from API...');
        
        // Try to fetch from API with better error handling
        const response = await fetch('http://localhost:5000/api/clothes', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Fetched data:', data);
        
        if (!data || data.length === 0) {
          throw new Error('No products found in database');
        }
        
        // Get only the latest 4 items
        const latestItems = data
          .sort((a, b) => new Date(b.createdAt || b._id) - new Date(a.createdAt || a._id))
          .slice(0, 4);
        
        setProducts(latestItems);
        console.log('Products set:', latestItems);
        
      } catch (err) {
        console.error('Error fetching clothes:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClothes();
  }, []);

  const handleAddToCart = async (product) => {
    alert(`${product.name || product.title} added to cart!`);
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">New Arrivals</h2>
            <p className="text-gray-600">Loading products from your database...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="w-full h-64 bg-gray-300 animate-pulse"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-300 rounded mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">New Arrivals</h2>
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p className="font-bold">Connection Error:</p>
              <p>{error}</p>
              <p className="mt-2 text-sm">
                Please check:
                <br />• Is your backend server running on localhost:5000?
                <br />• Is the /api/clothes endpoint working?
                <br />• Check browser console for more details
              </p>
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (!products || products.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">New Arrivals</h2>
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
              <p>No products found in your database.</p>
              <p className="text-sm mt-2">Add some products to your database to see them here.</p>
            </div>
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
            <div 
              key={product._id} 
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative group">
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
                  className="w-full mt-3 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors duration-300"
                  onClick={() => handleAddToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <p className="text-green-600 text-sm">
            ✓ Loaded {products.length} products from your database
          </p>
        </div>
      </div>
    </section>
  )
}

// YouTube Section with Animation
const YouTubeSection = () => {
  const [sectionRef, sectionInView] = useInView(0.3)

  return (
    <section ref={sectionRef} className="py-12 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`w-full h-[500px] sm:h-[550px] lg:h-[600px] transform transition-all duration-1000 ${sectionInView ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
          <iframe
            className="w-full h-full rounded-xl shadow-2xl transition-shadow duration-500 hover:shadow-3xl"
            src="https://www.youtube.com/embed/CKtH-doJ2aM?autoplay=1&mute=1"
            title="Fashion Show"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        <h3 className={`text-center text-gray-800 text-2xl font-bold mt-6 transform transition-all duration-1000 delay-300 ${sectionInView ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          Watch Our Latest Fashion Show
        </h3>
      </div>
    </section>
  )
}

// Client Ratings Component with Animations
const ClientRatings = () => {
  const [sectionRef, sectionInView] = useInView(0.1)
  
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
            className={`w-5 h-5 transition-colors duration-300 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
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
    <section ref={sectionRef} className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-12 transform transition-all duration-1000 ${sectionInView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
          <p className="text-gray-600">Trusted by thousands of satisfied customers worldwide</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <div 
              key={review.id} 
              className={`bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-lg transition-all duration-500 transform hover:-translate-y-2 ${
                sectionInView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <div className="flex items-center mb-4">
                <img 
                  src={review.avatar} 
                  alt={review.name}
                  className="w-12 h-12 rounded-full mr-4 transition-transform duration-300 hover:scale-110"
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
        
        <div className={`text-center mt-12 transform transition-all duration-1000 delay-500 ${sectionInView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="inline-flex items-center space-x-8">
            <div className="text-center group">
              <div className="text-3xl font-bold text-blue-600 transition-transform duration-300 group-hover:scale-110">4.8</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl font-bold text-blue-600 transition-transform duration-300 group-hover:scale-110">2,500+</div>
              <div className="text-sm text-gray-600">Happy Customers</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl font-bold text-blue-600 transition-transform duration-300 group-hover:scale-110">99%</div>
              <div className="text-sm text-gray-600">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Offer Banners Component with Animations
const OfferBanners = () => {
  const [sectionRef, sectionInView] = useInView(0.1)

  return (
    <section ref={sectionRef} className="py-16 bg-gradient-to-r from-purple-600 to-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className={`bg-white rounded-lg p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 ${sectionInView ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'}`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Summer Sale</h3>
                <p className="text-gray-600 mb-4">Up to 50% off on selected items</p>
                <button className="bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-all duration-300 transform hover:scale-105 active:scale-95">
                  Shop Now
                </button>
              </div>
              <div className="text-right">
                <span className="text-4xl font-bold text-red-500 animate-pulse">50%</span>
                <p className="text-sm text-gray-600">OFF</p>
              </div>
            </div>
          </div>
          
          <div className={`bg-gradient-to-r from-orange-400 to-pink-500 rounded-lg p-8 text-white shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 ${sectionInView ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}>
            <h3 className="text-2xl font-bold mb-2">Free Shipping</h3>
            <p className="mb-4">On orders over $99</p>
            <div className="flex items-center">
              <svg className="w-8 h-8 mr-3 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z" />
              </svg>
              <span className="font-semibold">Fast & Reliable Delivery</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {[
            { color: 'bg-green-500', title: 'Quality Guarantee', subtitle: '30-day money back', icon: 'M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' },
            { color: 'bg-blue-500', title: '24/7 Support', subtitle: 'Always here to help', icon: 'M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z' },
            { color: 'bg-purple-500', title: 'Secure Payment', subtitle: 'Protected transactions', icon: 'M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z' }
          ].map((item, index) => (
            <div 
              key={index}
              className={`${item.color} text-white rounded-lg p-6 text-center hover:shadow-lg transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 ${
                sectionInView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 200 + 400}ms` }}
            >
              <svg className="w-12 h-12 mx-auto mb-3 transition-transform duration-300 hover:scale-110" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d={item.icon} clipRule="evenodd" />
              </svg>
              <h4 className="font-bold mb-1">{item.title}</h4>
              <p className="text-sm">{item.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Main Home Component
const Home = () => {
  return (
    <div className="overflow-x-hidden">
      <HeroSection />
      <NewArrivals />
      <YouTubeSection />
      <ClientRatings />
      <OfferBanners />
      <FooterMultiColumn/>
    </div>
  )
}

export default Home