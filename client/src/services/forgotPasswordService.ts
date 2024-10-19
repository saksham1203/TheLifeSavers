// services/forgotPasswordService.ts
import axios, { AxiosInstance, AxiosResponse } from 'axios';

// Create Axios instance for Forgot Password API
const forgotPasswordAPI: AxiosInstance = axios.create({
  baseURL: 'https://the-life-savers-backend.vercel.app/api',
  // const API_URL = 'http://localhost:5000/api';
});

// Function to send OTP to the user's email (POST)
export const sendOtpToEmail = async (email: string): Promise<any> => {
  try {
    const { data }: AxiosResponse<any> = await forgotPasswordAPI.post('/forgot-password', { email });
    return data;
  } catch (error: any) {
    console.error('Failed to send OTP to email:', error);
    const errorMessage = error.response?.data?.message || 'Failed to send OTP to email';
    throw new Error(errorMessage);
  }
};

// Function to reset the password using OTP (POST)
export const resetPassword = async (
  email: string,
  otp: string,
  newPassword: string
): Promise<any> => {
  try {
    const { data }: AxiosResponse<any> = await forgotPasswordAPI.post('/reset-password', {
      email,
      otp,
      newPassword,
    });
    return data;
  } catch (error: any) {
    console.error('Failed to reset password:', error);
    const errorMessage = error.response?.data?.message || 'Failed to reset password';
    throw new Error(errorMessage);
  }
};
