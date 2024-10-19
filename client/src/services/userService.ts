// services/userService.ts
import axios, { AxiosResponse } from 'axios';

// Define API Base URL for Users
const API_URL = 'https://the-life-savers-backend.vercel.app/api/users';
// const API_URL = 'http://localhost:5000/api';

// Helper function to get token from localStorage
const getAuthToken = () => localStorage.getItem('token');

// Interface for User Update Data
export interface UpdateUserData {
  name?: string;
  email?: string;
  mobileNumber?: string;
  profileImage?: FileList | string;
  [key: string]: any; // Allow additional dynamic properties
}

// Update User Data (PUT)
export const updateUserDataService = async (
  userId: string,
  formData: UpdateUserData
): Promise<any> => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error('Authentication token is missing');

    const response: AxiosResponse<any> = await axios.put(
      `${API_URL}/${userId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data', // Ensure correct content type for form data
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('Failed to update user data:', error);
    const errorMessage = error.response?.data?.message || 'Failed to update user data';
    throw new Error(errorMessage);
  }
};
