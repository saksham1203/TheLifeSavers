// services/dashboardService.ts
import axios, { AxiosInstance, AxiosResponse } from 'axios';

// Create Axios instance with base URL
const dashboardAPI: AxiosInstance = axios.create({
  baseURL: 'https://the-life-savers-backend.vercel.app/api',
  // const API_URL = 'http://localhost:5000/api';
});

// Automatically set the Authorization header if token is available
dashboardAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  // Handle request errors
  console.error('Request error:', error);
  return Promise.reject(error);
});

// Fetch Donors (GET)
export const getDonors = async (
  country: string,
  state: string,
  district: string,
  city: string,
  bloodGroup: string
): Promise<any> => {
  try {
    const { data }: AxiosResponse<any> = await dashboardAPI.get(
      `/users`,
      {
        params: { country, state, district, city, bloodGroup },
      }
    );
    return data;
  } catch (error: any) {
    console.error('Failed to fetch donors:', error);
    const errorMessage = error.response?.data?.message || 'Failed to fetch donors';
    throw new Error(errorMessage);
  }
};

// Verify Password (POST)
export const verifyPassword = async (password: string): Promise<any> => {
  try {
    const { data }: AxiosResponse<any> = await dashboardAPI.post(`/verify-password`, { password });
    return data;
  } catch (error: any) {
    console.error('Failed to verify password:', error);
    const errorMessage = error.response?.data?.message || 'Failed to verify password';
    throw new Error(errorMessage);
  }
};
