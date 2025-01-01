import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useParams, Link } from 'react-router-dom';
import { useGetProductQuery } from '../../provider/queries/Products.query';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Typography, Button, Chip, Divider } from '@mui/material';
import Slider from 'react-slick';
import { useState } from 'react';
import ProductTabs from './components/ProductsTabs';
import { useGetCategoriesQuery } from '../../provider/queries/Category.query';
import ProductRating from '../../components/Rating';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SecurityIcon from '@mui/icons-material/Security';
import CachedIcon from '@mui/icons-material/Cached';
import AddReview from './components/AddReview';

function ProductDetails() {
  const { id } = useParams();

  const [selectedImage, setSelectedImage] = useState<string>(''); // State to store selected image
  const { data: product, error, isLoading, refetch } = useGetProductQuery(id);   
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
    vertical: true,
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: '0px',
    focusOnSelect: true,
    mouseWheel: true,
    beforeChange: (current: number, next: number) => {
      const newSelectedImage = product.product.images[next];
      setSelectedImage(newSelectedImage);
    },
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 768,
        settings: {
          vertical: false,
          slidesToShow: 3,
          centerMode: true,
        }
      }
    ]
  };

  const handleReviewAdded = () => {
    // Refetch reviews or update UI as needed
    refetch();
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50">
      {/* Breadcrumbs with enhanced styling */}
      <Breadcrumbs aria-label="breadcrumb" className="mb-8 pl-3 bg-white p-4 rounded-lg shadow-sm">
        <Link to="/home" className="text-gray-600 hover:text-blue-600 transition-colors">
          Home
        </Link>
        <Link to={`/category/${categoryDetails?.name}`} className="text-gray-600 hover:text-blue-600 transition-colors">
          {categoryDetails?.name}
        </Link>
        <Typography color="textPrimary" className="text-gray-800 font-medium">
          {product.product.name}
        </Typography>
      </Breadcrumbs>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white rounded-xl shadow-lg p-8">
        {/* Thumbnail Carousel */}
        <div className="lg:col-span-2 order-2 lg:order-1">
          <Slider {...sliderSettings} className="product-thumbnails">
            {product.product.images.map((img, index) => (
              <div key={index} className="p-2">
                <img
                  src={img}
                  alt={`product-thumbnail-${index}`}
                  className={`w-full aspect-square object-cover cursor-pointer rounded-lg transition-all
                    ${selectedImage === img ? 'ring-2 ring-blue-500' : 'hover:ring-2 hover:ring-blue-300'}`}
                  onClick={() => setSelectedImage(img)}
                />
              </div>
            ))}
          </Slider>
        </div>

        {/* Main Image */}
        <div className="lg:col-span-6 order-1 lg:order-2">
          <div className="bg-white rounded-xl p-4 flex items-center justify-center">
            <img
              src={selectedImage}
              alt="Selected Product"
              className="object-contain rounded-lg transition-opacity duration-300"
              style={{ maxHeight: '500px', width: '100%' }}
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="lg:col-span-4 order-3 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {product.product.name}
            </h1>
            <div className="flex items-center gap-4 mb-4">
              <ProductRating id={id} />
              <span className="text-gray-500">{product.product.rating}</span>
            </div>
          </div>

          <AddReview 
            productId={id} 
            onReviewAdded={handleReviewAdded}
          />

          <Divider />

          <div className="space-y-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-blue-600">
                ₹{product.product.price.toFixed(2)}
              </span>
              <Chip label="Free Delivery" color="success" size="small" />
            </div>

            <div className="flex gap-4">
              <Button 
                variant="contained" 
                color="primary" 
                size="large"
                startIcon={<ShoppingCartIcon />}
                fullWidth
                sx={{ 
                  py: 1.5,
                  textTransform: 'none',
                  fontSize: '1.1rem'
                }}
              >
                Add to Cart
              </Button>
              <Button 
                variant="outlined" 
                color="primary"
                size="large"
                fullWidth
                sx={{ 
                  py: 1.5,
                  textTransform: 'none',
                  fontSize: '1.1rem'
                }}
              >
                Buy Now
              </Button>
            </div>
          </div>

          <Divider />

          {/* Product Features */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <LocalShippingIcon />
              <span>Free Delivery</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <SecurityIcon />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <CachedIcon />
              <span>Easy Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Tabs */}
      <div className="mt-8">
        <ProductTabs 
          description={product.product.description} 
          reviews={product.product.reviews || []} 
          id={id} 
        />
      </div>
    </div>
  );
}

export default ProductDetails;