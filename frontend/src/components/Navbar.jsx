import React from 'react';
import { Link } from 'react-router-dom';
import { UserCircleIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';

const Navbar = ({ cartCount = 0 }) => {
  return (
    <nav className="fixed w-full bg-white shadow-md z-50 top-0">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-indigo-600">
          SheinStore
        </Link>

        {/* Navigation Links */}
        <ul className="hidden md:flex space-x-8 text-gray-700 font-semibold">
          <li>
            <Link to="/" className="hover:text-indigo-600 transition">Home</Link>
          </li>
          <li>
            <Link to="/shop" className="hover:text-indigo-600 transition">Shop</Link>
          </li>
          <li>
            <Link to="/about" className="hover:text-indigo-600 transition">About</Link>
          </li>
        </ul>

        {/* Login + Cart Icons */}
        <div className="flex items-center space-x-4">
          {/* Cart Icon with Count */}
          <Link to="/cart" className="text-indigo-600 hover:text-indigo-800 transition relative">
            <ShoppingCartIcon className="h-6 w-6" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>

          {/* Login Icon */}
          <Link to="/login" className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-800 transition font-semibold">
            <UserCircleIcon className="h-6 w-6" />
            <span className="hidden sm:inline">Login</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;