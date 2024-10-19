import axios, { AxiosResponse } from 'axios';

// Define API Base URL to avoid repetition
const API_URL = 'https://the-life-savers-backend.vercel.app/api/reviews';
// const API_URL = 'http://localhost:5000/api';

// Review Interfaces
export interface Review {
  userId: string;
  _id: string;
  username: string;
  rating: number;
  comment: string;
  image?: string;
}

export interface CreateReviewData {
  userId: string;
  rating: number;
  comment: string;
  image?: string;
}

export interface UpdateReviewData {
  name?: string;
  rating?: number;
  comment?: string;
  fileUpload?: FileList;
  image?: string;
}

// Helper function to get token from localStorage
const getAuthToken = () => localStorage.getItem('token');

// Fetch Reviews (GET)
export const fetchReviews = async (): Promise<Review[]> => {
  try {
    const { data }: AxiosResponse<Review[]> = await axios.get(API_URL);
    return data;
  } catch (error: any) {
    console.error('Failed to fetch reviews:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch reviews');
  }
};

// Create a New Review (POST)
export const createReview = async (newReviewData: CreateReviewData): Promise<Review> => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error('Authentication token is missing');

    const { data }: AxiosResponse<Review> = await axios.post(API_URL, newReviewData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error: any) {
    console.error('Failed to create review:', error);
    throw new Error(error.response?.data?.message || 'Failed to create review');
  }
};

// Update Review (PUT)
export const updateReview = async (id: string, updatedData: Partial<UpdateReviewData>): Promise<Review> => {
  try {
    const { data }: AxiosResponse<Review> = await axios.put(`${API_URL}/${id}`, updatedData);
    return data;
  } catch (error: any) {
    console.error('Failed to update review:', error);
    throw new Error(error.response?.data?.message || 'Failed to update review');
  }
};

// Delete Review (DELETE)
export const deleteReview = async (id: string): Promise<{ message: string }> => {
  try {
    const { data }: AxiosResponse<{ message: string }> = await axios.delete(`${API_URL}/${id}`);
    return data;
  } catch (error: any) {
    console.error('Failed to delete review:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete review');
  }
};
