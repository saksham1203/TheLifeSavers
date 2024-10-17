import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserEdit, FaSignOutAlt, FaHome, FaStar } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useAuth } from '../../Context/AuthContext';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth(); // Get auth state and logout function
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Toggle the dropdown menu
  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  // Navigate to the dashboard
  const handleDashboard = () => {
    setIsDropdownOpen(false);
    navigate('/dashboard');
  };

  // Handle user logout
  const handleLogout = () => {
    toast.success('Logged out successfully');
    setIsDropdownOpen(false);
    logout();
    navigate('/login');
  };

  // Navigate to the edit profile page
  const handleEditProfile = () => {
    setIsDropdownOpen(false);
    navigate('/profile');
  };

  // Navigate to the reviews page
//   const handleReviews = () => {
//     navigate('/user-reviews');
//   };

  // Close dropdown if clicked outside
  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header>
      <div className="fixed top-0 w-full z-10 p-1 text-center bg-gray-800 text-white animate-fade-in">
        <div className="container mx-auto px-0 flex justify-between items-center h-12">
          <div className="flex items-center animate-slide-in">
            <img
              src="https://clipart-library.com/newhp/361-3616036_blood-donation-logo-png.png"
              alt="Logo"
              className="h-8 w-8 mr-2"
            />
            <span className="text-xl font-bold cursor-pointer hover:text-red-600 transition-colors duration-300">
              Life Savers
            </span>
          </div>
          <div className="flex items-center">
            {/* Always visible Reviews button */}
            {/* <button
              className="px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded flex items-center mr-4"
              onClick={handleReviews}
            >
              <FaStar className="mr-2" /> Reviews
            </button> */}
            {/* User information and dropdown menu */}
            {isAuthenticated && user && (
              <div className="flex items-center">
                <div className="mr-2">{`${user.firstName} ${user.lastName}`}</div>
                <div className="relative" ref={dropdownRef}>
                  <div
                    className="h-8 w-8 flex items-center justify-center bg-gray-600 text-white rounded-full cursor-pointer transition-transform duration-300 transform hover:scale-105"
                    onClick={toggleDropdown}
                  >
                    {`${user.firstName.charAt(0)}${user.lastName.charAt(0)}`}
                  </div>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 text-white shadow-lg z-10 animate-fade-in">
                      <div className="py-1">
                        <button
                          className="px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 w-full text-left flex items-center justify-center"
                          onClick={handleDashboard}
                        >
                          <FaHome className="mr-2" /> Dashboard
                        </button>
                        <button
                          className="px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 w-full text-left flex items-center justify-center"
                          onClick={handleEditProfile}
                        >
                          <FaUserEdit className="mr-2" /> Edit Profile
                        </button>
                        <button
                          className="px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 w-full text-left flex items-center justify-center"
                          onClick={handleLogout}
                        >
                          <FaSignOutAlt className="mr-2" /> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
