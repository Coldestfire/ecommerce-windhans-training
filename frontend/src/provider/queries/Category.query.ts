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

    // Create a new category
    createCategory: builder.mutation<Category, CreateCategoryDTO>({
      query: (data) => ({
        url: '/categories',
        method: 'POST',
        body: data,
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem("token"),
        },
      }),
      invalidatesTags: ['Categories'],
    }),

    // Update an existing category
    updateCategory: builder.mutation<Category, { id: string; data: Partial<CreateCategoryDTO> }>({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: 'PATCH',
        body: data,
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem("token"),
        },
      }),
      invalidatesTags: ['Categories'],
    }),

    // Delete a category
    deleteCategory: builder.mutation<void, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem("token"),
        },
      }),
      invalidatesTags: ['Categories'],
    }),

  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation
} = CategoryApi;