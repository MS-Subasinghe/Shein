import React from 'react';
import ClothesDisplay from '../components/ClothesDisplay';

const Shop = ({ onCartUpdate }) => {
  return (
    <div className="min-h-screen">
      <ClothesDisplay onCartUpdate={onCartUpdate} />
    </div>
  );
};

export default Shop;