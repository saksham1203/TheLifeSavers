import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 border-t border-gray-700 fixed bottom-0 w-full z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center h-12">
        <span className="text-sm text-white">© 2024 My Website. All rights reserved.</span>
        <div className="flex space-x-4">
          <a 
            href="https://www.facebook.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="transform transition-transform duration-300 hover:scale-125"
          >
            <FontAwesomeIcon icon={faFacebook} className="text-white hover:text-red-500 h-6 w-6" />
          </a>
          <a 
            href="https://www.twitter.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="transform transition-transform duration-300 hover:scale-125"
          >
            <FontAwesomeIcon icon={faTwitter} className="text-white hover:text-red-500 h-6 w-6" />
          </a>
          <a 
            href="https://www.instagram.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="transform transition-transform duration-300 hover:scale-125"
          >
            <FontAwesomeIcon icon={faInstagram} className="text-white hover:text-red-500 h-6 w-6" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
