/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define TypeScript interfaces
interface CartItem {
  productId: {
    _id: string;
    name: string;
    price: number;
    images: string[];
  };
  quantity: number;
  price: number;
}

interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
  totalPrice: number;
  status: 'pending' | 'completed';
  createdAt: string;
  updatedAt: string;
}

interface AddToCartDTO {
  productId: string;
  quantity: number;
}

interface UpdateCartItemDTO {
  productId: string;
  quantity: number;
}

export const CartApi = createApi({
  reducerPath: 'CartApi',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BACKEND_URL + "/api" }),
  
  tagTypes: ['Cart'],
  endpoints: (builder) => ({
    // Create a new cart
    createCart: builder.mutation<Cart, void>({
      query: () => ({
        url: '/cart',
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem("token"),
        },
      }),
      invalidatesTags: ['Cart'],
    }),

    // Get user's cart
    getCart: builder.query<Cart, void>({
      query: () => ({
        url: '/cart',
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem("token"),
        },
      }),
      providesTags: ['Cart'],
    }),

    // Add item to cart
    addToCart: builder.mutation<Cart, AddToCartDTO>({
      query: (data) => ({
        url: '/cart/add',
        method: 'POST',
        body: data,
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem("token"),
        },
      }),
      invalidatesTags: ['Cart'],
    }),

    // Update cart item
    updateCartItem: builder.mutation<Cart, UpdateCartItemDTO>({
      query: (data) => ({
        url: '/cart/update',
        method: 'PATCH',
        body: data,
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem("token"),
        },
      }),
      invalidatesTags: ['Cart'],
    }),

    // Remove item from cart
    removeFromCart: builder.mutation<Cart, string>({
      query: (productId) => ({
        url: `/cart/remove/${productId}`,
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem("token"),
        },
      }),
      invalidatesTags: ['Cart'],
    }),

    // Checkout cart
    checkoutCart: builder.mutation<Cart, void>({
      query: () => ({
        url: '/cart/checkout',
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem("token"),
        },
      }),
      invalidatesTags: ['Cart'],
    }),

    // Clear cart
    clearCart: builder.mutation<void, void>({
      query: () => ({
        url: '/cart/clear',
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem("token"),
        },
      }),
      invalidatesTags: ['Cart'],
    }),
  }),
});

export const {
  useCreateCartMutation,
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useCheckoutCartMutation,
  useClearCartMutation,
} = CartApi;