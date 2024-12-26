import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { SidebarSlice } from "./slice/Sidebar.slice";
import { AuthApi } from "./queries/Auth.query.ts";
import { ProductApi } from "./queries/Products.query.ts";
import { UserSlice } from "./slice/user.slice.tsx";
// import refreshReducer from "./slice/refreshSlice";

export const store = configureStore({
    reducer:{
        [SidebarSlice.name]: SidebarSlice.reducer,
        [AuthApi.reducerPath]: AuthApi.reducer,
        [ProductApi.reducerPath]: ProductApi.reducer,
        [UserSlice.name]: UserSlice.reducer,
        // refresh: refreshReducer,
        
    },

   

    middleware: (d) => d().concat(
        AuthApi.middleware, 
        ProductApi.middleware,
    )

}) 

setupListeners(store.dispatch)