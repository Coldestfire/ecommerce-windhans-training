import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface CreateOrderResponse {
  id: string;
  razorpayOrderId: string;
  amount: number;
  currency: string;
}

interface VerifyPaymentRequest {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export const paymentApi = createApi({
  reducerPath: 'paymentApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'http://localhost:8000/api/payment',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    createOrder: builder.mutation<CreateOrderResponse, number>({
      query: (amount) => ({
        url: '/create-order',
        method: 'POST',
        body: { amount },
      }),
    }),
    verifyPayment: builder.mutation<{ success: boolean }, VerifyPaymentRequest>({
      query: (body) => ({
        url: '/verify-payment',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { 
  useCreateOrderMutation,
  useVerifyPaymentMutation,
} = paymentApi;
