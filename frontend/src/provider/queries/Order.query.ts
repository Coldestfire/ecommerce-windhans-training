import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface OrderItem {
  product: {
    _id: string;
    name: string;
    images: string[];
    price: number;
  };
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  totalAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  paymentStatus: 'pending' | 'completed' | 'failed';
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  createdAt: string;
  products: OrderItem[];
}

export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8000/api/orders',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getOrders: builder.query<Order[], void>({
      query: () => '/',
    }),
  }),
});

export const { useGetOrdersQuery } = orderApi; 