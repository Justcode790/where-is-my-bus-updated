import React from 'react';
import { Link } from 'react-router-dom';

const Vahan = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
      <div className="flex flex-col items-center space-y-6">
        <img 
          src="./Screenshot_2025-09-10_195914-removebg-preview.png" 
          alt="Vahan"
        />

        {/* Start (Login) Button */}
        <Link to="/login">
          <button className="px-6 py-3 bg-white text-purple-600 font-semibold rounded-full shadow-lg hover:bg-purple-600 hover:text-white transition duration-300">
            Agency
          </button>
        </Link>

        {/* User Button */}
        <Link to="/user">
          <button className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-full shadow-lg hover:bg-blue-600 hover:text-white transition duration-300">
            User
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Vahan;
