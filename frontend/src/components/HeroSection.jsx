import { useState, useEffect } from 'react'

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
      {/* Animated dark overlay */}
      <div 
        className={`absolute inset-0 bg-black transition-opacity duration-1000 ${
          isLoaded ? 'opacity-50' : 'opacity-80'
        }`}
      ></div>

      {/* Floating particles background */}
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

      {/* Content with staggered animations */}
      <div className="relative max-w-4xl">
        <h1 
          className={`text-4xl md:text-6xl font-extrabold mb-6 drop-shadow-lg transform transition-all duration-1000 ${
            isLoaded 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-8 opacity-0'
          }`}
          style={{ animationDelay: '0.2s' }}
        >
          {title}
        </h1>
        
        <p 
          className={`text-lg md:text-xl mb-8 drop-shadow-md transform transition-all duration-1000 ${
            isLoaded 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-8 opacity-0'
          }`}
          style={{ animationDelay: '0.4s' }}
        >
          {subtitle}
        </p>
        
        <div
          className={`transform transition-all duration-1000 ${
            isLoaded 
              ? 'translate-y-0 opacity-100 scale-100' 
              : 'translate-y-8 opacity-0 scale-95'
          }`}
          style={{ animationDelay: '0.6s' }}
        >
          <a
            href={buttonLink}
            className="group inline-block bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold px-8 py-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl relative overflow-hidden"
          >
            {/* Button shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 transition-all duration-700 group-hover:translate-x-full"></div>
            
            {/* Button text */}
            <span className="relative z-10 flex items-center justify-center">
              {buttonText}
              <svg 
                className="ml-2 w-5 h-5 transform transition-transform duration-300 group-hover:translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div 
        className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-1000 ${
          isLoaded ? 'opacity-70 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
        style={{ animationDelay: '1s' }}
      >
        <div className="animate-bounce">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  )
}

export default HeroSection