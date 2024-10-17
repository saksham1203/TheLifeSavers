import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const ErrorPage: React.FC = () => {
  // Automatically focus the 'Go to Home' button for accessibility
  useEffect(() => {
    const focusButton = document.getElementById('go-home-button');
    focusButton?.focus();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen animate-fade-in">
      <div className="text-center p-8 max-w-lg mx-auto bg-white shadow-lg rounded-lg animate-slide-in">
        <h1 className="text-6xl font-extrabold text-red-500 mb-4" aria-label="404 Error">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Oops! Page Not Found
        </h2>
        <p className="text-gray-600 mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable. 
        </p>
        <Link
          to="/dashboard"
          id="go-home-button"
          className="inline-block px-6 py-2 text-white bg-red-500 hover:bg-red-600 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-transform duration-300 transform hover:scale-105"
          aria-label="Go to Dashboard"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
