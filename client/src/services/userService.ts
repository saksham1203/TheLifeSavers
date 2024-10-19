// services/userService.ts
import axios, { AxiosResponse } from 'axios';

// Dynamic baseURL selection based on the environment
const baseURL =
  window.location.hostname === 'localhost'
    ? 'http://localhost:5000/api'
    : 'https://the-life-savers-backend.vercel.app/api';

// Axios instance with dynamic baseURL
const userAPI = axios.create({ baseURL });

// Automatically set the Authorization header if token is available
userAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Update user data by user ID.
 * @param userId - ID of the user to update.
 * @param formData - Data to update the user with.
 * @returns A promise resolving to the updated user data.
 */
export const updateUserDataService = async (
  userId: string,
  formData: any
): Promise<AxiosResponse<any>> => {
  try {
    const response = await userAPI.put(`/users/${userId}`, formData);
    return response.data;
  } catch (error: any) {
    console.error('Failed to update user data:', error);
    const errorMessage = error.response?.data?.message || 'Failed to update user data';
    throw new Error(errorMessage);
  }
};
