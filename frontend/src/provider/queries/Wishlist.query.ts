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
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BACKEND_URL + "/api" }),
  
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
      async onQueryStarted(productId, { dispatch, queryFulfilled, getState }) {
        const state = getState() as any;
        const wishlist = state.WishlistApi.queries['getWishlist(undefined)']?.data;
        
        // Optimistically update the wishlist
        const patchResult = dispatch(
          WishlistApi.util.updateQueryData('getWishlist', undefined, (draft) => {
            if (!draft) return;
            draft.items.push({
              productId: {
                _id: productId,
                name: '', // Will be updated when query completes
                price: 0,
                images: []
              },
              addedAt: new Date().toISOString()
            });
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
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
      async onQueryStarted(productId, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          WishlistApi.util.updateQueryData('getWishlist', undefined, (draft) => {
            if (!draft) return;
            draft.items = draft.items.filter(item => item.productId._id !== productId);
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useCreateWishlistMutation,
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} = WishlistApi;
