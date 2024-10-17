// services/userService.ts
import axios from 'axios';

export const updateUserDataService = async (userId: string, formData: any) => {
  const token = localStorage.getItem("token");
  const response = await axios.put(`https://the-life-savers-backend.vercel.app/api/users/${userId}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
