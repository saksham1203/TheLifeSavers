import React, { useState, useEffect, useMemo } from "react";
import { Outlet } from "react-router-dom";
import { AuthProvider } from "../Context/AuthContext";
import Header from "../Components/Header/Header";
import Footer from "../Components/Footer/Footer";
import ContactIcon from "../Components/ContactIcon/ContactIcon";
import ReviewIcon from "../Components/ReviewIcon/ReviewIcon";
import SplashScreen from "../Components/SplashScreen/SplashScreen";
import ErrorBoundary from "../Components/ErrorBoundary";

const AppLayout = () => {
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  useEffect(() => {
    // Check if splash screen has already been shown to the user
    const splashShown = sessionStorage.getItem("splashShown");

    if (!splashShown) {
      // Show splash screen on first visit
      const timer = setTimeout(() => {
        setIsSplashVisible(false);
        sessionStorage.setItem("splashShown", "true"); // Set session storage so the splash doesn't show again
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      // Skip splash screen for repeat visitors
      setIsSplashVisible(false);
    }
  }, []);

  // Memoize header, footer, and icons for better performance
  const memoizedHeader = useMemo(() => <Header />, []);
  const memoizedFooter = useMemo(() => <Footer />, []);
  const memoizedReviewIcon = useMemo(() => <ReviewIcon />, []);
  const memoizedContactIcon = useMemo(() => <ContactIcon />, []);

  return (
    <AuthProvider>
      <ErrorBoundary>
        <div className="flex flex-col min-h-screen">
          {isSplashVisible ? (
            <SplashScreen />
          ) : (
            <>
              {memoizedHeader}
              <main className="flex-1">
                {/* Skeleton loader can be added here while content loads */}
                <Outlet />
              </main>
              {memoizedReviewIcon}
              {memoizedContactIcon}
              {memoizedFooter}
            </>
          )}
        </div>
      </ErrorBoundary>
    </AuthProvider>
  );
};

export default AppLayout;
