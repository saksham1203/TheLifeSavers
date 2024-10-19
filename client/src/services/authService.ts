import axios, { AxiosResponse } from 'axios';
export const loginRequest = async (data: { identifier: string; password: string; rememberMe: boolean }) => {
    try {
      const response = await fetch("https://the-life-savers-backend.vercel.app/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error('Failed to login');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Login request failed:', error);
      throw error;
    }
  };



export const sendOtp = (email: string): Promise<AxiosResponse<any>> => {
  return axios.post('https://the-life-savers-backend.vercel.app/api/send-verification-otp', { email });
};

export const verifyOtp = (email: string, otp: string): Promise<AxiosResponse<any>> => {
  return axios.post('https://the-life-savers-backend.vercel.app/api/verify-otp', { email, otp });
};

export const registerUser = (newUser: any): Promise<AxiosResponse<any>> => {
  const transformedData = {
    ...newUser,
    mobileNumber: `+91${newUser.mobileNumber}`,
    availability: newUser.availability === 'available',
  };
  return axios.post('https://the-life-savers-backend.vercel.app/api/register', transformedData);
};



export const verifyPassword = async (password: string) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(
    'https://the-life-savers-backend.vercel.app/api/verify-password',
    { password },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};


  


  