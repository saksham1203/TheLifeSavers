import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the User interface
interface User {
  userId: any;
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string; // Optional as it's not needed in the frontend
  mobileNumber: string;
  bloodGroup: string;
  gender: string;
  availability: boolean;
  country: string;
  state: string;
  district: string;
  city: string;
  termsAccepted: boolean;
  createdAt: string;
  updatedAt: string;
  reviewId?: string; // ReviewId if present
}

// Define the UserReview interface
interface UserReview {
  _id: string;
  username: string;
  rating: number;
  comment: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

// Define the AuthContext type
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  userReview: UserReview | false | null; // Handle cases where userReview is false or null
  login: (token: string, user: User, userReview: UserReview | false) => void; // Removed the optionality from userReview
  logout: () => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [userReview, setUserReview] = useState<UserReview | false | null>(null); // Handle userReview state

  useEffect(() => {
    const token = localStorage.getItem("token");
    const tokenExpiration = localStorage.getItem("tokenExpiration");

    if (token && tokenExpiration) {
      const now = new Date();
      const expirationDate = new Date(tokenExpiration);

      if (now < expirationDate) {
        setIsAuthenticated(true);
        const storedUser = localStorage.getItem("user");
        const storedUserReview = localStorage.getItem("userReview");

        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        if (storedUserReview && storedUserReview !== "false") {
          setUserReview(JSON.parse(storedUserReview));
        } else {
          setUserReview(false);
        }
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("tokenExpiration");
        localStorage.removeItem("user");
        localStorage.removeItem("userReview");
      }
    }
  }, []);

  const login = (token: string, user: User, userReview: UserReview | false) => {
    setIsAuthenticated(true);
    setUser(user);
    setUserReview(userReview);

    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);

    if (userReview) {
      localStorage.setItem("userReview", JSON.stringify(userReview));
    } else {
      localStorage.setItem("userReview", "false");
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setUserReview(null);
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiration");
    localStorage.removeItem("user");
    localStorage.removeItem("userReview");
  };

  const setAuthenticated = (isAuthenticated: boolean) => {
    setIsAuthenticated(isAuthenticated);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, userReview, login, logout, setAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
