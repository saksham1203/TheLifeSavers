import axios, { AxiosResponse } from 'axios';

// Define a base URL to avoid repetition
const API_URL = 'https://the-life-savers-backend.vercel.app/api';
// const API_URL = 'http://localhost:5000/api';

// Helper function to get token from localStorage
const getAuthToken = () => localStorage.getItem('token');

// Login Request
export const loginRequest = async (data: { identifier: string; password: string; rememberMe: boolean }) => {
  try {
    const response: AxiosResponse<any> = await axios.post(`${API_URL}/login`, data, {
      headers: { 'Content-Type': 'application/json' },
    });

    return response.data;
  } catch (error: any) {
    console.error('Login request failed:', error);
    const errorMessage = error.response?.data?.message || 'Failed to login';
    throw new Error(errorMessage);
  }
};

// Send OTP
export const sendOtp = (email: string): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/send-verification-otp`, { email })
    .catch(error => {
      console.error('Failed to send OTP:', error);
      throw error;
    });
};

// Verify OTP
export const verifyOtp = (email: string, otp: string): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/verify-otp`, { email, otp })
    .catch(error => {
      console.error('Failed to verify OTP:', error);
      throw error;
    });
};

// Register User
interface NewUser {
  name: string;
  email: string;
  password: string;
  mobileNumber: string;
  availability: string;
}

export const registerUser = (newUser: NewUser): Promise<AxiosResponse<any>> => {
  const transformedData = {
    ...newUser,
    mobileNumber: `+91${newUser.mobileNumber}`,
    availability: newUser.availability === 'available',
  };

  return axios.post(`${API_URL}/register`, transformedData)
    .catch(error => {
      console.error('User registration failed:', error);
      throw error;
    });
};

// Verify Password
export const verifyPassword = async (password: string) => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error('No authentication token found');

    const response = await axios.post(
      `${API_URL}/verify-password`,
      { password },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return response.data;
  } catch (error: any) {
    console.error('Password verification failed:', error);
    const errorMessage = error.response?.data?.message || 'Failed to verify password';
    throw new Error(errorMessage);
  }
};
