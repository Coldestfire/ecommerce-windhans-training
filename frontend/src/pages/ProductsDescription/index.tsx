// ProductDetails.tsx
import { useParams, Link } from 'react-router-dom';
import { useGetProductQuery } from '../../provider/queries/Products.query';
import Rating from '@mui/material/Rating';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Typography, Button, Box } from '@mui/material';

import { useState } from 'react';
import ProductTabs from './components/ProductsTabs';
import { useGetCategoriesQuery } from '../../provider/queries/Category.query';           

function ProductDetails() {
  const { id } = useParams(); // Get the product ID from the URL
  const [value, setValue] = useState<number | null>(2); // Rating value
  const { data: product, error, isLoading } = useGetProductQuery(id);   
  const { data: fetchedCategories, isLoading: isLoadingCategories } = useGetCategoriesQuery({category:""});

  // Show loading state
  if (isLoading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  // Show error message if fetching fails
  if (error) {
    return <div className="text-center p-4 text-red-500">{error.message}</div>;
  }

  // Assuming fetchedCategories.data contains the categories
const categoryDetails = fetchedCategories?.data?.find(
  (cat) => cat._id === product?.product.category

);

const categoryName = categoryDetails?.name || "Unknown Category";


  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs for navigation */}
      <Breadcrumbs aria-label="breadcrumb" className="mb-6 pl-3">
        <Link to="/home" className="text-gray-600 hover:text-blue-600">
          Home
        </Link>
        <Link
          to={`/category/${categoryDetails?.name}`}
          className="text-gray-600 hover:text-blue-600"
        >
          {console.log("product.product: ", product.product)}
          {categoryDetails?.name}
        </Link>
        <Typography color="textPrimary" className="text-gray-800">
          {product.product.name}
        </Typography>
      </Breadcrumbs>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-lg shadow-xl p-6">
        {/* Product Image */}
        <div className="flex justify-center">
          <img
            src={product.product.image}
            alt="product-image"
            className="w-full max-w-md h-auto object-cover rounded-lg shadow-lg"
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col space-y-6">
          {/* Product Name */}
          <h1 className="text-4xl font-extrabold text-gray-900 hover:text-gray-700 transition duration-300">
            {product.product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center space-x-2">
            <Rating name="simple-controlled" value={value} readOnly sx={{ fontSize: '1.2rem' }} />
            <span className="text-gray-600 text-sm">({product.product.rating} ratings)</span>
          </div>

          {/* Price */}
          <p className="text-2xl font-semibold text-gray-800 mt-4">
            <strong className="font-bold">Price:</strong> &#8377;{product.product.price.toFixed(2)}
          </p>

          {/* Buttons */}
          <Box className="flex gap-4 mt-4">
            <Button variant="contained" color="primary" sx={{ flex: 1 }}>
              Buy Now
            </Button>
            <Button variant="outlined" color="primary" sx={{ flex: 1 }}>
              Add to Cart
            </Button>
          </Box>
        </div>
      </div>

      {/* Add some margin for the ProductTabs section to separate it from the product details */}
      <div className="mt-8">
        {/* Product Tabs Component */}
        <ProductTabs
          description={product.product.description}
          reviews={product.product.reviews || []} // If no reviews, send an empty array
        />
      </div>
    </div>
  );
}

export default ProductDetails;
