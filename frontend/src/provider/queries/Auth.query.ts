/* eslint-disable @typescript-eslint/no-explicit-any */

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const AuthApi = createApi({
    reducerPath: 'AuthApi',
    baseQuery: fetchBaseQuery({ 
        baseUrl: "http://localhost:8000/api",
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token")?.trim();
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        }
    }),
    endpoints: (builder) => ({
        registerUser: builder.mutation<any,any>({
            query: (obj) => ({
                url:'/auth/register',
                method:'POST',
                body: obj
            })
        }),
        loginUser: builder.mutation<any, any>({
            query: (obj) => ({
                url: '/auth/login',
                method: 'POST',
                body: obj
            })
        }),
        getProfile: builder.query<any, any>({
            query: () => ({
                url: '/auth/profile',
                method: 'GET'
            })
        }),
    }),
})


export const { useRegisterUserMutation,useLoginUserMutation, useGetProfileQuery } = AuthApi