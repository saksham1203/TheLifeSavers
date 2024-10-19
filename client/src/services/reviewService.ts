import axios from "axios";

// Define a base URL for the API
// const BASE_URL = "https://the-life-savers-backend.vercel.app/api/reviews";

const BASE_URL = 
  window.location.hostname === 'localhost' 
    ? 'http://localhost:5000/api/reviews' 
    : 'https://the-life-savers-backend.vercel.app/api/reviews';

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

// Axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token") || ""}`, // Optional: Prefetch token for reusability
  },
});

// Fetch reviews function
export const fetchReviews = async () => {
  const { data } = await axiosInstance.get("/");
  return data;
};

// Create a new review function (POST)
export const createReview = async (newReviewData: CreateReviewData) => {
  const { data } = await axiosInstance.post("/", newReviewData);
  return data;
};

// Update review function (PUT)
export const updateReview = async ({
  id,
  updatedData,
}: {
  id: string;
  updatedData: Partial<UpdateReviewData>;
}) => {
  const { data } = await axiosInstance.put(`/${id}`, updatedData);
  return data;
};

// Delete review function (DELETE)
export const deleteReview = async (id: string) => {
  const { data } = await axiosInstance.delete(`/${id}`);
  return data;
};
