import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { useParams, Link } from 'react-router-dom';
import { useGetProductQuery } from '../../provider/queries/Products.query';
import Rating from '@mui/material/Rating';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Typography, Button, Box } from '@mui/material';
import Slider from 'react-slick';  // Importing react-slick Slider component
import { useState } from 'react';
import ProductTabs from './components/ProductsTabs';
import { useGetCategoriesQuery } from '../../provider/queries/Category.query';

function ProductDetails() {
  const { id } = useParams();
  const [value, setValue] = useState<number | null>(2); 
  const [selectedImage, setSelectedImage] = useState<string>(''); // State to store selected image
  const { data: product, error, isLoading } = useGetProductQuery(id);   
  const { data: fetchedCategories } = useGetCategoriesQuery({ category: "" });

  if (isLoading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error.message}</div>;
  }

  const categoryDetails = fetchedCategories?.data?.find(
    (cat) => cat._id === product?.product.category._id
  );

  // Set the default image when the product is loaded
  const initialImage = product.product.images[0];
  if (!selectedImage) {
    setSelectedImage(initialImage);
  }

  // Slider settings for vertical carousel
  const sliderSettings = {
    vertical: true, // Enables vertical mode
    dots: false, // Optional: show navigation dots
    infinite: true,
    speed: 500,
    slidesToShow: 4, // Number of images visible at a time
    slidesToScroll: 1, // Scroll one image at a time
    initialSlide: 0,
    focusOnSelect: true, // Allows clicking on image to select it
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs aria-label="breadcrumb" className="mb-6 pl-3">
        <Link to="/home" className="text-gray-600 hover:text-blue-600">Home</Link>
        <Link to={`/category/${categoryDetails?.name}`} className="text-gray-600 hover:text-blue-600">
          {categoryDetails?.name}
        </Link>
        <Typography color="textPrimary" className="text-gray-800">
          {product.product.name}
        </Typography>
      </Breadcrumbs>

      <div className="flex flex-col lg:flex-row gap-3 bg-white rounded-lg shadow-xl p-6">
        {/* Small Images List Section - Vertical Carousel */}
        <div className="w-full lg:w-1/6">
          <Slider {...sliderSettings}>
            {product.product.images.map((img, index) => (
              <div key={index}>
                <img
                  src={img}
                  alt={`product-thumbnail-${index}`}
                  className="w-32 h-32 object-cover cursor-pointer rounded-md hover:border-4 hover:border-blue-600"
                  onClick={() => setSelectedImage(img)}
                />
              </div>
            ))}
          </Slider>
        </div>

        {/* Main Image Display */}
        <div className="flex justify-center items-center w-full lg:w-5/6">
          <img
            src={selectedImage}
            alt="Selected Product"
            className="object-contain rounded-lg shadow-lg"
            style={{
              // You can adjust these values as per your needs
              width: '100%', // Adjust width (100% means the image will scale to the full width of the container)
              height: 'auto', // This ensures the aspect ratio is maintained
              maxWidth: '100%', // This ensures the image doesn't overflow horizontally
              maxHeight: '600px', // Adjust the maximum height (change as per desired size)
            }}
          />
        </div>

        {/* Product Details Section */}
        <div className="flex flex-col space-y-6 w-full lg:w-1/2">
          <h1 className="text-4xl font-extrabold text-gray-900 hover:text-gray-700 transition duration-300">
            {product.product.name}
          </h1>

          <div className="flex items-center space-x-2">
            <Rating name="simple-controlled" value={value} readOnly sx={{ fontSize: '1.2rem' }} />
            <span className="text-gray-600 text-sm">({product.product.rating} ratings)</span>
          </div>

          <p className="text-2xl font-semibold text-gray-800 mt-4">
            <strong className="font-bold">Price:</strong> &#8377;{product.product.price.toFixed(2)}
          </p>

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

      <div className="mt-8">
        <ProductTabs description={product.product.description} reviews={product.product.reviews || []} />
      </div>
    </div>
  );
}

export default ProductDetails;
