import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { SidebarSlice } from "./slice/Sidebar.slice";
import { AuthApi } from "./queries/Auth.query.ts";
import { ProductApi } from "./queries/Products.query.ts";
import { UserSlice } from "./slice/user.slice.tsx";
import { CategoryApi } from "./queries/Category.query.ts";
import { ReviewApi } from "./queries/Reviews.query.ts";
import { CartApi } from "./queries/Cart.query.ts";
import { WishlistApi } from "./queries/Wishlist.query.ts";
import { paymentApi } from "./queries/Payment.query.ts";
import { orderApi } from "./queries/Order.query.ts";
// import refreshReducer from "./slice/refreshSlice";

export const store = configureStore({
    reducer:{
        [SidebarSlice.name]: SidebarSlice.reducer,
        [AuthApi.reducerPath]: AuthApi.reducer,
        [ProductApi.reducerPath]: ProductApi.reducer,
        [UserSlice.name]: UserSlice.reducer,
        [CategoryApi.reducerPath]: CategoryApi.reducer,
        [ReviewApi.reducerPath]: ReviewApi.reducer,
        [CartApi.reducerPath]: CartApi.reducer,
        [WishlistApi.reducerPath]: WishlistApi.reducer,
        [paymentApi.reducerPath]: paymentApi.reducer,
        [orderApi.reducerPath]: orderApi.reducer,
        // refresh: refreshReducer,
        
    },

   

    middleware: (d) => d().concat(
        AuthApi.middleware, 
        ProductApi.middleware,
        CategoryApi.middleware,
        ReviewApi.middleware,
        CartApi.middleware,
        WishlistApi.middleware,
        paymentApi.middleware,
        orderApi.middleware,
    )

}) 

setupListeners(store.dispatch)