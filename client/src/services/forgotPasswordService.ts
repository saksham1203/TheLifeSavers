import axios from "axios";

const forgotPasswordAPI = axios.create({
  baseURL: "https://the-life-savers-backend.vercel.app/api",
});

// Function to send OTP to the user's email
export const sendOtpToEmail = async (email: string) => {
  const { data } = await forgotPasswordAPI.post("/forgot-password", { email });
  return data;
};

// Function to reset the password using OTP
export const resetPassword = async (email: string, otp: string, newPassword: string) => {
  const { data } = await forgotPasswordAPI.post("/reset-password", {
    email,
    otp,
    newPassword,
  });
  return data;
};
