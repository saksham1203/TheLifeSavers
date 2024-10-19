import axios from "axios";

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

// Fetch reviews function
export const fetchReviews = async () => {
  const { data } = await axios.get("https://the-life-savers-backend.vercel.app/api/reviews");
  return data;
};

// Create a new review function (POST)
export const createReview = async (newReviewData: CreateReviewData) => {
  const token = localStorage.getItem("token");
  const { data } = await axios.post(
    "https://the-life-savers-backend.vercel.app/api/reviews",
    newReviewData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
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
  const { data } = await axios.put(
    `https://the-life-savers-backend.vercel.app/api/reviews/${id}`,
    updatedData
  );
  return data;
};

// Delete review function (DELETE)
export const deleteReview = async (id: string) => {
  const { data } = await axios.delete(`https://the-life-savers-backend.vercel.app/api/reviews/${id}`);
  return data;
};
