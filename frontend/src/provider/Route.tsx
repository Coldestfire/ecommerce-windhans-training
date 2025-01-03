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
import AdminRoute from "../components/AdminRoute";
import Checkout from "../pages/Checkout";
import PaymentSuccess from "../pages/PaymentSuccess";
import OrdersPage from "../pages/Orders";
// import ProtectedRoute from "../components/ProtectedRoute";

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
        element: (
          <AdminRoute>
            <ProductsList />
          </AdminRoute>
        ),
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
      },
      {
      
        path: "/checkout",
        element:  <Checkout />
      },
      {
        path: "/payment-success",
        element: <PaymentSuccess />
      },
      {
        path: "/orders",
        element: <OrdersPage />
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
