// Shop.jsx
//import HeroSection from '../components/HeroSection';
import ClothesDisplay from '../components/ClothesDisplay';
import NavBar from '../components/NavBar'; 
import Footer from '../components/Footer'

const Shop = () => {
  return (
    <>
      <NavBar />
      <div>
        <h2 className="text-3xl font-bold text-center my-8">All Products</h2>
        <ClothesDisplay />
      </div>

        <Footer/>
    </>
  );
};

export default Shop;
