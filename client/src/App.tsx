import { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppLayout from "./layout/AppLayout";
import ErrorPage from "./pages/ErrorPage/ErrorPage";
import ProtectedRoute from "./Components/ProtectedRoute";
import PublicRoute from "./Components/PublicRoute"; // New public route component

// Lazy load components to optimize performance
const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard"));
const UserProfile = lazy(() => import("./pages/UserProfile/UserProfile"));
const Register = lazy(() => import("./pages/Register/Register"));
const Login = lazy(() => import("./pages/Login/Login"));
const UserReviews = lazy(() => import("./pages/UserReviews/UserReviews"));
const ForgotPassword = lazy(() => import("./Components/ForgotPassword/ForgotPassword"));

// Create a QueryClient instance with enhanced config
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2, // Retry failed requests up to 2 times
      refetchOnWindowFocus: false, // Disable refetch on window focus for better performance
      // cacheTime: 1000 * 60 * 5, // Cache data for 5 minutes
      staleTime: 1000 * 60, // Data stays fresh for 1 minute
    },
  },
});

// Centralized paths for consistency
const PATHS = {
  ROOT: '/',
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  REVIEWS: '/reviews',
};

const App = () => {
  const router = createBrowserRouter([
    {
      path: PATHS.ROOT,
      element: <AppLayout />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: PATHS.ROOT,
          element: (
            <PublicRoute>
              <Suspense fallback={<div>Loading...</div>}>
                <Register />
              </Suspense>
            </PublicRoute>
          ),
        },
        {
          path: PATHS.LOGIN,
          element: (
            <PublicRoute>
              <Suspense fallback={<div>Loading...</div>}>
                <Login />
              </Suspense>
            </PublicRoute>
          ),
        },
        {
          path: PATHS.FORGOT_PASSWORD,
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <ForgotPassword />
            </Suspense>
          ),
        },
        {
          path: PATHS.DASHBOARD,
          element: <ProtectedRoute />,
          children: [
            {
              path: PATHS.DASHBOARD,
              element: (
                <Suspense fallback={<div>Loading...</div>}>
                  <Dashboard />
                </Suspense>
              ),
            },
          ],
        },
        {
          path: PATHS.PROFILE,
          element: <ProtectedRoute />,
          children: [
            {
              path: PATHS.PROFILE,
              element: (
                <Suspense fallback={<div>Loading...</div>}>
                  <UserProfile />
                </Suspense>
              ),
            },
          ],
        },
        {
          path: PATHS.REVIEWS,
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <UserReviews />
            </Suspense>
          ),
        },
        {
          path: '*',
          element: <ErrorPage />,
        },
      ],
    },
  ]);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
};

export default App;
