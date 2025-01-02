/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define TypeScript interfaces
interface WishlistItem {
  productId: {
    _id: string;
    name: string;
    price: number;
    images: string[];
  };
  addedAt: string;
}

interface Wishlist {
  _id: string;
  userId: string;
  items: WishlistItem[];
  createdAt: string;
  updatedAt: string;
}

export const WishlistApi = createApi({
  reducerPath: 'WishlistApi',
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000/api" }),
  
  tagTypes: ['Wishlist'],
  endpoints: (builder) => ({
    // Create a new wishlist
    createWishlist: builder.mutation<Wishlist, void>({
      query: () => ({
        url: '/wishlist',
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem("token"),
        },
      }),
      invalidatesTags: ['Wishlist'],
    }),

    // Get user's wishlist
    getWishlist: builder.query<Wishlist, void>({
      query: () => ({
        url: '/wishlist',
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem("token"),
        },
      }),
      providesTags: ['Wishlist'],
    }),

    // Add item to wishlist
    addToWishlist: builder.mutation<Wishlist, string>({
      query: (productId) => ({
        url: '/wishlist/add',
        method: 'POST',
        body: { productId },
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem("token"),
        },
      }),
      invalidatesTags: ['Wishlist'],
    }),

    // Remove item from wishlist
    removeFromWishlist: builder.mutation<Wishlist, string>({
      query: (productId) => ({
        url: `/wishlist/remove/${productId}`,
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem("token"),
        },
      }),
      invalidatesTags: ['Wishlist'],
    }),
  }),
});

export const {
  useCreateWishlistMutation,
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} = WishlistApi;
