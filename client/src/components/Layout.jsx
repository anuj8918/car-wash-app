
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaCar } from 'react-icons/fa';

const Navbar = () => {
  
  const navigate = useNavigate();
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40 border-b border-gray-200">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
            <FaCar className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-800">WashWise</span>
          </div>
          <div>
            <button
              onClick={() => navigate('/create')}
              className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-semibold rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              <FaPlus />
              New Booking
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;