/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


// Define TypeScript interfaces
interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string |null;
  lowStockThreshold: number;
  createdAt: string;
  updatedAt: string;
}

interface ProductStats {
  totalProducts: number;
  lowStockProducts: number;
}

interface CreateProductDTO {
  name: string;
  description: string;
  price: number;
  stock: number | null;
  lowStockThreshold?: number;
  image?: string | null;
}

interface GetAllProductsResponse {
  hasMore: GetAllProductsResponse | undefined;
  data : Product[];
  name: string;
  description: string;
  price: number;
  stock: number | null;
  lowStockThreshold?: number;
}


export const ProductApi = createApi({
  reducerPath: 'ProductApi',
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000/api" }),
  
  tagTypes: ['Products', 'ProductStats'],
  endpoints: (builder) => ({
    // Get all products with pagination and search
    getAllProducts: builder.query<GetAllProductsResponse, { query: string; page: number ; category: string }>({
      query: ({ query, page, category }) => ({
        url: `/products`,
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem("token"),
        },
        params: {
          page,      // Page number
          query,     // Search query
          category,  // Category filter
        },
      }),
      providesTags: ['Products'],
    }),

    getEveryProduct: builder.query<GetAllProductsResponse, any>({
      query: () => ({
        url: `/products/every`,
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem("token"),
        },
      }),
      providesTags: ['Products'],
    }),

    // Get a single product
    getProduct: builder.query<Product, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem("token"),
        },
      }),
      providesTags: ['Products'],
    }),

    // Create a new product
    createProduct: builder.mutation<Product, CreateProductDTO>({
      query: (data) => ({
        url: '/products',
        method: 'POST',
        body: data,
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem("token"),
        },
      }),
      invalidatesTags: ['Products', 'ProductStats'],
    }),

    // Update an existing product
    updateProduct: builder.mutation<Product, { id: string; data: Partial<CreateProductDTO> }>({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: 'PATCH',
        body: data,
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem("token"),
        },
      }),
      invalidatesTags: ['Products', 'ProductStats'],
    }),

    // Delete a product
    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem("token"),
        },
      }),
      invalidatesTags: ['Products', 'ProductStats'],
    }),

    // Get product statistics for dashboard
    getProductStats: builder.query<ProductStats, void>({
      query: () => ({
        url: '/products/stats',
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem("token"),
        },
      }),
      providesTags: ['ProductStats'],
    }),

    // Get products for search/dropdown
    getProductsForSearch: builder.query<Product[], void>({
      query: () => ({
        url: '/products/search',
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem("token"),
        },
      }),
      providesTags: ['Products'],
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetEveryProductQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductStatsQuery,
  useGetProductsForSearchQuery,
} = ProductApi;