import React, { useState, useEffect, useRef, useCallback } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FaEnvelope, FaCopy } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

const ContactIcon: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const email = "example@example.com"; // Dummy email
  const popupRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    setIsVisible((prevVisible) => !prevVisible);
  };

  const handleCopy = () => {
    toast.success("Email copied to clipboard!"); // Display toast on copy
  };

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsVisible(false);
      }
    },
    [setIsVisible]
  );

  useEffect(() => {
    if (isVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isVisible, handleClickOutside]);

  return (
    <>
      {/* Toast Container */}
      <Toaster />

      <div className="fixed bottom-14 right-4 flex flex-col items-center">
        {/* Email Popup */}
        <div
          ref={popupRef}
          className={`absolute bottom-full mb-2 bg-red-500 shadow-lg rounded-lg p-3 transition-all duration-300 ease-in-out transform ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
          }`}
          style={{ right: 0, width: "max-content", minWidth: "12rem" }} // Adjust width and positioning
        >
          <div className="flex items-center justify-between">
            <a
              href={`https://mail.google.com/mail/?view=cm&fs=1&to=${email}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white truncate"
              aria-label={`Send email to ${email}`}
            >
              {email}
            </a>
            <CopyToClipboard text={email} onCopy={handleCopy}>
              <button
                className="ml-2 p-1 text-white hover:text-gray-200 transition-colors duration-300 ease-in-out"
                aria-label="Copy email to clipboard"
              >
                <FaCopy size={16} />
              </button>
            </CopyToClipboard>
          </div>
        </div>

        {/* Contact Icon */}
        <button
          className="p-3 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors duration-300 ease-in-out"
          onClick={handleClick}
          aria-expanded={isVisible}
          aria-controls="contact-email-popup"
          aria-label="Show contact email"
        >
          <FaEnvelope size={24} />
        </button>
      </div>
    </>
  );
};

export default ContactIcon;
