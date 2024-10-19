import axios, { AxiosResponse } from "axios";

export interface Review {
  userId: any;
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
  name: string;
  rating: number;
  comment: string;
  fileUpload?: FileList;
  image?: string;
}

// Dynamic baseURL selection based on the environment
const baseURL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://the-life-savers-backend.vercel.app/api";

// Axios instance with dynamic baseURL
const reviewsAPI = axios.create({ baseURL });

// Automatically set the Authorization header if token is available
reviewsAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Fetch all reviews.
 * @returns A promise resolving to the list of reviews.
 */
export const fetchReviews = async (): Promise<Review[]> => {
  try {
    const { data } = await reviewsAPI.get("/reviews");
    return data;
  } catch (error: any) {
    console.error("Failed to fetch reviews:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch reviews");
  }
};

/**
 * Create a new review.
 * @param newReviewData - Data for the new review.
 * @returns A promise resolving to the created review.
 */
export const createReview = async (
  newReviewData: CreateReviewData
): Promise<AxiosResponse<any>> => {
  try {
    const { data } = await reviewsAPI.post("/reviews", newReviewData);
    return data;
  } catch (error: any) {
    console.error("Failed to create review:", error);
    throw new Error(error.response?.data?.message || "Failed to create review");
  }
};

/**
 * Update an existing review.
 * @param id - ID of the review to update.
 * @param updatedData - Partial data to update the review.
 * @returns A promise resolving to the updated review.
 */
export const updateReview = async (
  id: string,
  updatedData: Partial<UpdateReviewData>
): Promise<AxiosResponse<any>> => {
  try {
    const { data } = await reviewsAPI.put(`/reviews/${id}`, updatedData);
    return data;
  } catch (error: any) {
    console.error("Failed to update review:", error);
    throw new Error(error.response?.data?.message || "Failed to update review");
  }
};

/**
 * Delete a review.
 * @param id - ID of the review to delete.
 * @returns A promise resolving to the deletion response.
 */
export const deleteReview = async (id: string): Promise<AxiosResponse<any>> => {
  try {
    const { data } = await reviewsAPI.delete(`/reviews/${id}`);
    return data;
  } catch (error: any) {
    console.error("Failed to delete review:", error);
    throw new Error(error.response?.data?.message || "Failed to delete review");
  }
};
