/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


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

    // Update an existing review
    updateReview: builder.mutation<any, { id: string; data: { rating: number; review: string } }>({
      query: ({ id, data }) => ({
        url: `/reviews/${id}`,
        method: 'PATCH',
        body: data,
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem("token"),
        },
      }),
      invalidatesTags: ['Reviews'],
    }),

    // Delete a review
    deleteReview: builder.mutation<any, any>({
      query: (id) => ({
        url: `/reviews/${id}`,
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem("token"),
        },
      }),
      invalidatesTags: ['Reviews'],
    }),

  }),
});

export const {
  useGetReviewQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation
} = ReviewApi;