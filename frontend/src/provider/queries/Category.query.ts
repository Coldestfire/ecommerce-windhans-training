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
  name: string;
  description: string;
}

interface GetAllCategoryResponse {
  name: string;
  description: string;
}


export const CategoryApi = createApi({
  reducerPath: 'CategoryApi',
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000/api" }),
  
  tagTypes: ['Categories'],
  endpoints: (builder) => ({

    // Get all categories with pagination and search
    getCategories: builder.query<GetAllCategoryResponse, { category: string }>({
      query: ({ category }) => ({
        url: `/categories`,
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem("token"),
        },
        params: {
          category,  // Category filter
        },
      }),
      providesTags: ['Categories'],
    }),

    // Get a single category
    getCategoryById: builder.query<Category, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem("token"),
        },
      }),
      providesTags: ['Categories'],
    }),

    // // Create a new category
    // createCategory: builder.mutation<Category, CreateCategoryDTO>({
    //   query: (data) => ({
    //     url: '/categories',
    //     method: 'POST',
    //     body: data,
    //     headers: {
    //       'Authorization': 'Bearer ' + localStorage.getItem("token"),
    //     },
    //   }),
    //   invalidatesTags: ['Categories'],
    // }),

    // // Update an existing product
    // updateProduct: builder.mutation<Product, { id: string; data: Partial<CreateProductDTO> }>({
    //   query: ({ id, data }) => ({
    //     url: `/products/${id}`,
    //     method: 'PATCH',
    //     body: data,
    //     headers: {
    //       'Authorization': 'Bearer ' + localStorage.getItem("token"),
    //     },
    //   }),
    //   invalidatesTags: ['Products', 'ProductStats'],
    // }),

    // // Delete a product
    // deleteProduct: builder.mutation<void, string>({
    //   query: (id) => ({
    //     url: `/products/${id}`,
    //     method: 'DELETE',
    //     headers: {
    //       'Authorization': 'Bearer ' + localStorage.getItem("token"),
    //     },
    //   }),
    //   invalidatesTags: ['Products', 'ProductStats'],
    // }),

    // // Get product statistics for dashboard
    // getProductStats: builder.query<ProductStats, void>({
    //   query: () => ({
    //     url: '/products/stats',
    //     method: 'GET',
    //     headers: {
    //       'Authorization': 'Bearer ' + localStorage.getItem("token"),
    //     },
    //   }),
    //   providesTags: ['ProductStats'],
    // }),

    // // Get products for search/dropdown
    // getProductsForSearch: builder.query<Product[], void>({
    //   query: () => ({
    //     url: '/products/search',
    //     method: 'GET',
    //     headers: {
    //       'Authorization': 'Bearer ' + localStorage.getItem("token"),
    //     },
    //   }),
    //   providesTags: ['Products'],
    // }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery
} = CategoryApi;