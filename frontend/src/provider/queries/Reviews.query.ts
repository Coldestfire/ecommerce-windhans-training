/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


// Define TypeScript interfaces
interface Category {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}


interface CreateCategoryDTO {
  rating: number;
  review: string;
}

interface GetAllCategoryResponse {
  name: string;
  description: string;
}


export const ReviewApi = createApi({
  reducerPath: 'ReviewApi',
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000/api" }),
  
  tagTypes: ['Reviews'],
  endpoints: (builder) => ({

    // Get all Reviews with pagination and search
    getReview: builder.query<any, any>({
      query: (productId ) => ({
        url: `/reviews`,
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem("token"),
        },
        params: {
          productId,  // Category filter
        },
      }),
      providesTags: ['Reviews'],
    }),


    // Create a new review
    createReview: builder.mutation<any, any>({
      query: (data) => ({
        url: '/reviews',
        method: 'POST',
        body: data,
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem("token"),
        },
      }),
      invalidatesTags: ['Reviews'],
    }),

    // // Update an existing category
    // updateCategory: builder.mutation<Category, { id: string; data: Partial<CreateCategoryDTO> }>({
    //   query: ({ id, data }) => ({
    //     url: `/products/${id}`,
    //     method: 'PATCH',
    //     body: data,
    //     headers: {
    //       'Authorization': 'Bearer ' + localStorage.getItem("token"),
    //     },
    //   }),
    //   invalidatesTags: ['Categories'],
    // }),

    // // Delete a category
    // deleteCategory: builder.mutation<void, string>({
    //   query: (id) => ({
    //     url: `/categories/${id}`,
    //     method: 'DELETE',
    //     headers: {
    //       'Authorization': 'Bearer ' + localStorage.getItem("token"),
    //     },
    //   }),
    //   invalidatesTags: ['Categories'],
    // }),

  }),
});

export const {
  useGetReviewQuery,
  useCreateReviewMutation
} = ReviewApi;