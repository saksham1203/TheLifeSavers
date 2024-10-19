import axios, { AxiosResponse } from "axios";

// Dynamic baseURL selection based on the environment
const baseURL = 
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://the-life-savers-backend.vercel.app/api";

const forgotPasswordAPI = axios.create({ baseURL });

// Automatically set headers if needed (optional enhancement)
forgotPasswordAPI.interceptors.request.use((config) => {
  config.headers["Content-Type"] = "application/json";
  return config;
});

/**
 * Sends an OTP to the user's email for password reset.
 * @param email - The email address of the user.
 * @returns A promise resolving to the response data.
 */
export const sendOtpToEmail = async (email: string): Promise<AxiosResponse<any>> => {
  try {
    const { data } = await forgotPasswordAPI.post("/forgot-password", { email });
    return data;
  } catch (error: any) {
    console.error("Failed to send OTP:", error);
    const errorMessage = error.response?.data?.message || "Failed to send OTP";
    throw new Error(errorMessage);
  }
};

/**
 * Resets the password using the provided OTP and new password.
 * @param email - The user's email address.
 * @param otp - The OTP sent to the email.
 * @param newPassword - The new password to set.
 * @returns A promise resolving to the response data.
 */
export const resetPassword = async (
  email: string, 
  otp: string, 
  newPassword: string
): Promise<AxiosResponse<any>> => {
  try {
    const { data } = await forgotPasswordAPI.post("/reset-password", {
      email,
      otp,
      newPassword,
    });
    return data;
  } catch (error: any) {
    console.error("Failed to reset password:", error);
    const errorMessage = error.response?.data?.message || "Failed to reset password";
    throw new Error(errorMessage);
  }
};
