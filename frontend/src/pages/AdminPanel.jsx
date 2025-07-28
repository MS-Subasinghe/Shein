import React, { useState } from 'react';
import AdminClothesForm from '../components/AdminClothesForm';
import UsersList from '../components/UsersList';
import ClothesList from '../components/ClothesList';  // import ClothesList
import Dashboard from '../components/Dashboard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState('dashboard');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col bg-gray-100">
        <div className="flex flex-1">
          {/* Sidebar */}
          <aside className="w-56 bg-indigo-700 text-white flex flex-col p-6">
            <h2 className="text-2xl font-bold mb-10 text-center">Admin Panel</h2>

            <button
              onClick={() => setSelectedOption('dashboard')}
              className={`mb-4 py-2 px-4 rounded font-semibold text-center transition ${
                selectedOption === 'dashboard' ? 'bg-indigo-500' : 'hover:bg-indigo-600'
              }`}
            >
              Dashboard
            </button>

            <button
              onClick={() => setSelectedOption('addClothes')}
              className={`mb-4 py-2 px-4 rounded font-semibold text-center transition ${
                selectedOption === 'addClothes' ? 'bg-indigo-500' : 'hover:bg-indigo-600'
              }`}
            >
              Add Clothes
            </button>

            <button
              onClick={() => setSelectedOption('viewClothes')}
              className={`mb-4 py-2 px-4 rounded font-semibold text-center transition ${
                selectedOption === 'viewClothes' ? 'bg-indigo-500' : 'hover:bg-indigo-600'
              }`}
            >
              View Clothes
            </button>

            <button
              onClick={() => setSelectedOption('viewUsers')}
              className={`mb-4 py-2 px-4 rounded font-semibold text-center transition ${
                selectedOption === 'viewUsers' ? 'bg-indigo-500' : 'hover:bg-indigo-600'
              }`}
            >
              View Users
            </button>

            <button
              onClick={handleLogout}
              className="mt-auto bg-red-600 hover:bg-red-700 py-2 px-4 rounded text-center font-semibold"
            >
              Logout
            </button>
          </aside>

          {/* Main content */}
          <main className="flex-1 p-8 overflow-auto">
            {selectedOption === 'dashboard' && <Dashboard />}
            {selectedOption === 'addClothes' && (
              <>
                <h1 className="text-3xl font-bold mb-6 text-indigo-700">Add New Clothes</h1>
                <AdminClothesForm />
              </>
            )}
            {selectedOption === 'viewClothes' && <ClothesList />}
            {selectedOption === 'viewUsers' && (
              <>
                <h1 className="text-3xl font-bold mb-6 text-indigo-700">Registered Users</h1>
                <UsersList />
              </>
            )}
          </main>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default AdminPanel;
