import React, { useState, useEffect } from "react";

// ErrorBoundary component
const ErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  const resetError = () => setHasError(false);

  useEffect(() => {
    // Error handler for ErrorEvent
    const errorHandler = (ev: ErrorEvent) => {
      setHasError(true);
      console.error("Error caught in boundary:", ev.message); // Logs the error message from the event
    };

    window.addEventListener("error", errorHandler);

    return () => window.removeEventListener("error", errorHandler);
  }, []);

  return hasError ? (
    <div className="p-4 bg-red-100 text-red-500 text-center">
      Something went wrong. Please try again later.
      <button onClick={resetError} className="text-blue-500 ml-2 underline">
        Retry
      </button>
    </div>
  ) : (
    <>{children}</>
  );
};

export default ErrorBoundary;
