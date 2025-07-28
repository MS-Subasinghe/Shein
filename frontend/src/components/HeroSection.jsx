import { Link } from 'react-router-dom'

const HeroSection = ({
  title = "Your Favorite Clothing Store, Delivered Fast & Stylish.",
  subtitle = "Discover the latest trends and timeless styles in our extensive collection. Shop now and step up your fashion game!",
  buttonText = "Shop Now",
  buttonLink = "/shop",
  backgroundImage = "https://images.pexels.com/photos/135620/pexels-photo-135620.jpeg"
}) => {
  return (
    <section
      className="relative w-full min-h-screen flex items-center justify-center px-6 text-center text-white"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Content */}
      <div className="relative max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 drop-shadow-lg">
          {title}
        </h1>
        <p className="text-lg md:text-xl mb-8 drop-shadow-md">
          {subtitle}
        </p>
        <Link
          to={buttonLink}
          className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-4 rounded-full shadow-lg transition"
        >
          {buttonText}
        </Link>
      </div>
    </section>
  )
}

export default HeroSection
