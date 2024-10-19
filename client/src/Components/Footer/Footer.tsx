import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 border-t border-gray-700 fixed bottom-0 w-full z-10">
      <div className="container mx-auto px-2 py-2 flex flex-col sm:flex-row justify-between items-center">
        <span className="text-xs text-white text-center sm:text-left mb-1 sm:mb-0">
          © 2024 My Website. All rights reserved.
        </span>
        <div className="flex space-x-3">
          <a 
            href="https://www.facebook.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            aria-label="Visit our Facebook page"
            className="transform transition-transform duration-300 hover:scale-110"
          >
            <FontAwesomeIcon icon={faFacebook} className="text-white hover:text-red-500 h-6 w-4" />
          </a>
          <a 
            href="https://www.twitter.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            aria-label="Visit our Twitter profile"
            className="transform transition-transform duration-300 hover:scale-110"
          >
            <FontAwesomeIcon icon={faTwitter} className="text-white hover:text-red-500 h-6 w-4" />
          </a>
          <a 
            href="https://www.instagram.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            aria-label="Visit our Instagram profile"
            className="transform transition-transform duration-300 hover:scale-110"
          >
            <FontAwesomeIcon icon={faInstagram} className="text-white hover:text-red-500 h-6 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
