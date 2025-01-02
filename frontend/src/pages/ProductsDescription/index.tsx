import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useParams, Link } from 'react-router-dom';
import { useGetProductQuery } from '../../provider/queries/Products.query';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Typography, Button, Chip, Divider, Box } from '@mui/material';
import Slider from 'react-slick';
import { useState } from 'react';
import ProductTabs from './components/ProductsTabs';
import { useGetCategoriesQuery } from '../../provider/queries/Category.query';
import ProductRating from '../../components/Rating';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SecurityIcon from '@mui/icons-material/Security';
import CachedIcon from '@mui/icons-material/Cached';
import ReviewAction from './components/ReviewAction';
import { formatIndianPrice } from '../../themes/formatPrices';
import { useAddToCartMutation, useUpdateCartItemMutation, useGetCartQuery } from '../../provider/queries/Cart.query';
import { useAddToWishlistMutation, useGetWishlistQuery, useRemoveFromWishlistMutation } from '../../provider/queries/Wishlist.query';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddIcon from '@mui/icons-material/Add';
import { useProtectedAction } from '../../hooks/useProtectedAction';


function ProductDetails() {
  const { id } = useParams();

  const [selectedImage, setSelectedImage] = useState<string>(''); // State to store selected image
  const { data: product, error, isLoading, refetch } = useGetProductQuery(id);   
  const { data: fetchedCategories } = useGetCategoriesQuery({ category: "" });

  const [addToCart] = useAddToCartMutation();
  const [updateCartItem] = useUpdateCartItemMutation();
  const { data: cartData } = useGetCartQuery();
  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  const { data: wishlistData } = useGetWishlistQuery();

  const runProtectedAction = useProtectedAction();

  const isProductInCart = (productId: string) => {
    return cartData?.items?.some(item => item.productId._id === productId);
  };

  const isProductInWishlist = (productId: string) => {
    return wishlistData?.items?.some(item => item.productId._id === productId);
  };

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
    slidesToShow: Math.min(3, product.product.images.length),
    slidesToScroll: 1,
    centerMode: false,
    centerPadding: '0px',
    focusOnSelect: true,
    mouseWheel: product.product.images.length > 3,
    beforeChange: (current: number, next: number) => {
      const newSelectedImage = product.product.images[next];
      if (newSelectedImage !== selectedImage) {
        setSelectedImage(newSelectedImage);
      }
    },
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(3, product.product.images.length),
          infinite: false,
          centerMode: false
        }
      },
      {
        breakpoint: 768,
        settings: {
          vertical: false,
          slidesToShow: Math.min(3, product.product.images.length),
          infinite: false,
          centerMode: false
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
                  className={`w-full aspect-square object-contain cursor-pointer rounded-lg transition-all
                    ${selectedImage === img ? 'ring-2 ring-blue-500' : 'hover:ring-2 hover:ring-blue-300'}`}
                  style={{ maxHeight: '100px', width: '100%', objectFit: 'contain' }}
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
              style={{ maxHeight: '400px', width: '100%', objectFit: 'contain' }}
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

          <ReviewAction 
            productId={id} 
            onReviewAction={handleReviewAdded}
          />

          <Divider />

          <div className="space-y-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-blue-600">
                {formatIndianPrice(product.product.price)}
              </span>
      
              <Chip label="Free Delivery" color="success" size="small"/>

            </div>

          

            <div className="flex gap-4">
              <Button 
                variant="contained" 
                color="primary" 
                size="medium"
                startIcon={
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 0.5,
                  }}>
                    <ShoppingCartIcon sx={{ fontSize: '1.2rem' }} />
                    {isProductInCart(id) && (
                      <AddIcon sx={{ 
                        fontSize: '1.2rem',
                        opacity: 1,
                        transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      }} />
                    )}
                  </Box>
                }
                fullWidth
                onClick={() => {
                  runProtectedAction(async () => {
                    try {
                      if (isProductInCart(id)) {
                        const cartItem = cartData?.items?.find(item => item.productId._id === id);
                        if (cartItem) {
                          await updateCartItem({ productId: id, quantity: cartItem.quantity + 1 }).unwrap();
                          toast.success(`Added another ${product.product.name} to cart`);
                        }
                      } else {
                        await addToCart({ productId: id, quantity: 1 }).unwrap();
                        toast.success(`${product.product.name} added to cart`);
                      }
                    } catch (error) {
                      toast.error('Failed to update cart');
                    }
                  });
                }}
                sx={{ 
                  py: 0.75,
                  height: '36px',
                  textTransform: 'none',
                  fontSize: '1rem',
                  bgcolor: isProductInCart(id) ? 'primary.light' : 'primary.main',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    bgcolor: isProductInCart(id) ? 'primary.main' : 'primary.dark',
                  }
                }}
              >
                {isProductInCart(id) ? 'Add Another' : 'Add to Cart'}
              </Button>
              <Button 
                variant="outlined" 
                color="error"
                size="medium"
                startIcon={
                  <FavoriteIcon sx={{ 
                    fontSize: '1.2rem',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }} />
                }
                fullWidth
                onClick={() => {
                  runProtectedAction(async () => {
                    try {
                      if (isProductInWishlist(id)) {
                        await removeFromWishlist(id).unwrap();
                        toast.success(`${product.product.name} removed from wishlist`);
                      } else {
                        await addToWishlist(id).unwrap();
                        toast.success(`${product.product.name} added to wishlist`);
                      }
                    } catch (error) {
                      toast.error('Failed to update wishlist');
                    }
                  });
                }}

                sx={{ 
                  py: 0.75,
                  height: '36px',
                  textTransform: 'none',
                  fontSize: '0.875rem',
                  bgcolor: isProductInWishlist(id) ? 'error.light' : 'transparent',
                  color: isProductInWishlist(id) ? 'white' : 'error.main',
                  borderWidth: 2,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    bgcolor: isProductInWishlist(id) ? 'error.main' : 'error.light',
                    color: 'white',
                    borderWidth: 2
                  }
                }}
              >
                {isProductInWishlist(id) ? 'Remove' : 'Add to Wishlist'}
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

      <ToastContainer 
        position="top-left"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />
    </div>
  );
}

export default ProductDetails;