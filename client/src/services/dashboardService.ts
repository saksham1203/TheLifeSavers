import axios from "axios";

const dashboardAPI = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Automatically set the Authorization header if token is available
dashboardAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Export specific functions for fetching donors and verifying password

export const getDonors = async (country: string, state: string, district: string, city: string, bloodGroup: string) => {
  const { data } = await dashboardAPI.get(
    `/users?country=${country}&state=${state}&district=${district}&city=${city}&bloodGroup=${bloodGroup}`
  );
  return data;
};

export const verifyPassword = async (password: string) => {
  const { data } = await dashboardAPI.post(`/verify-password`, { password });
  return data;
};
