import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ProductsList from "../pages/ProductsList";
import ProductDetail from "../pages/ProductsDescription";
import ProductsLanding from "../pages/ProductsLanding";
import ProductsCategory from "../pages/ProductsCategory";
import CartPage from "../pages/Cart";
import WishlistPage from "../pages/Wishlist";
import First from "../pages/First";

export const Routes = createBrowserRouter([
  {
    path: "/",
    element: <App />, // Use JSX element here instead of Component
    children: [
      {
        path: "/",
        element: <First />,
      },
      {
        path: "/admin",
        element: <ProductsList />, // Main product listing page
      },
      {
        path: "/product/:id", // Dynamic route for product details
        element: <ProductDetail />, // Product details page
      },
      {
        path: "/category/:category",
        element: <ProductsCategory />
      },
      {
        path: "/home",
        element: <ProductsLanding />
      },
      {
        path: "/cart",
        element: <CartPage />
      },
      {
        path: "/wishlist",
        element: <WishlistPage />
      }
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);
