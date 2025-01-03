import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useParams, Link } from 'react-router-dom';
import { useGetProductQuery } from '../../provider/queries/Products.query';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Typography, Button, Chip, Divider, Box, IconButton, Dialog } from '@mui/material';
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
import CloseIcon from '@mui/icons-material/Close';
import RemoveIcon from '@mui/icons-material/Remove';
import { useRemoveFromCartMutation } from '../../provider/queries/Cart.query';


function ProductDetails() {
  const { id } = useParams();

  const [selectedImage, setSelectedImage] = useState<string>(''); // State to store selected image
  const [zoomModalOpen, setZoomModalOpen] = useState(false);
  const { data: product, error, isLoading, refetch } = useGetProductQuery(id);   
  const { data: fetchedCategories } = useGetCategoriesQuery({ category: "" });

  const [addToCart] = useAddToCartMutation();
  const [updateCartItem] = useUpdateCartItemMutation();
  const { data: cartData } = useGetCartQuery();
  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  const { data: wishlistData } = useGetWishlistQuery();
  const [removeFromCart] = useRemoveFromCartMutation();

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
    infinite: false,
    speed: 300,
    slidesToShow: Math.min(3, product.product.images.length),
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: '0px',
    focusOnSelect: true,
    mouseWheel: product.product.images.length > 3,
    initialSlide: product.product.images.findIndex(img => img === selectedImage),
    cssEase: 'cubic-bezier(0.4, 0, 0.2, 1)',
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
          infinite: true,
          centerMode: true
        }
      },
      {
        breakpoint: 768,
        settings: {
          vertical: false,
          slidesToShow: Math.min(3, product.product.images.length),
          infinite: true,
          centerMode: true
        }
      }
    ]
  };

  const handleReviewAdded = () => {
    // Refetch reviews or update UI as needed
    refetch();
  };

  const ZoomModal = ({ 
    open, 
    onClose, 
    image 
  }: { 
    open: boolean; 
    onClose: () => void; 
    image: string; 
  }) => {
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const handleWheel = (e: React.WheelEvent) => {
      e.preventDefault();
      const newScale = scale + (e.deltaY > 0 ? -0.1 : 0.1);
      setScale(Math.min(Math.max(1, newScale), 3));
    };

    const handleMouseDown = (e: React.MouseEvent) => {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
      if (isDragging && scale > 1) {
        setPosition({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    return (
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth={false}
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            boxShadow: 'none',
            position: 'relative',
            width: '100vw',
            height: '100vh',
          }
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
            color: 'white',
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.2)',
            }
          }}
        >
          <CloseIcon />
        </IconButton>
        
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: isDragging ? 'grabbing' : 'grab',
            overflow: 'hidden',
          }}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <img
            src={image}
            alt="Zoomed Product"
            style={{
              maxWidth: '90%',
              maxHeight: '90%',
              objectFit: 'contain',
              transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
              transition: isDragging ? 'none' : 'transform 0.1s',
            }}
            draggable={false}
          />
        </Box>
      </Dialog>
    );
  };

  const thumbnailStyles = {
    p: 2,
    '& img': {
      width: '100%',
      aspectRatio: '1',
      objectFit: 'contain',
      cursor: 'pointer',
      borderRadius: '8px',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      transform: 'scale(0.85)',
      opacity: 0.7,
      '&.selected': {
        transform: 'scale(1)',
        opacity: 1,
        boxShadow: '0 0 0 2px #3b82f6'
      },
      '&:hover': {
        transform: 'scale(0.95)',
        opacity: 0.9
      }
    }
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
              <Box
                key={index}
                sx={thumbnailStyles}
              >
                <img
                  src={img}
                  alt={`product-thumbnail-${index}`}
                  className={selectedImage === img ? 'selected' : ''}
                  onClick={() => setSelectedImage(img)}
                />
              </Box>
            ))}
          </Slider>
        </div>

        {/* Main Image */}
        <div className="lg:col-span-6 order-1 lg:order-2">
          <div 
            className="bg-white rounded-xl p-4 flex items-center justify-center cursor-zoom-in"
            onClick={() => setZoomModalOpen(true)}
          >
            <img
              src={selectedImage}
              alt="Selected Product"
              className="object-contain rounded-lg transition-opacity duration-300"
              style={{ maxHeight: '400px', width: '100%', objectFit: 'contain' }}
            />
          </div>
          <ZoomModal
            open={zoomModalOpen}
            onClose={() => setZoomModalOpen(false)}
            image={selectedImage}
          />
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
                    gap: 1.5,
                    width: '100%',
                    justifyContent: isProductInCart(id) ? 'space-between' : 'center',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}>
                    <ShoppingCartIcon sx={{ 
                      color: 'white',
                      fontSize: '1.2rem'
                    }} />
                    {isProductInCart(id) && cartData?.items && (
                      <Box 
                        sx={{ 
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          '@keyframes expandIn': {
                            '0%': {
                              width: '0',
                              opacity: 0
                            },
                            '100%': {
                              width: '100px',
                              opacity: 1
                            }
                          },
                          animation: 'expandIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          width: '100px'
                        }}
                      >
                        <IconButton
                          size="medium"
                          onClick={(e) => {
                            e.stopPropagation();
                            const currentQuantity = cartData?.items?.find(item => item.productId._id === id)?.quantity || 0;
                            if (currentQuantity > 1) {
                              runProtectedAction(async () => {
                                try {
                                  await updateCartItem({ productId: id, quantity: currentQuantity - 1 }).unwrap();
                                  toast.success(`Updated ${product.product.name} quantity`);
                                } catch (error) {
                                  toast.error('Failed to update quantity');
                                }
                              });
                            } else {
                              runProtectedAction(async () => {
                                try {
                                  await removeFromCart(id).unwrap();
                                  toast.success(`${product.product.name} removed from cart`);
                                } catch (error) {
                                  toast.error('Failed to remove from cart');
                                }
                              });
                            }
                          }}
                          sx={{
                            p: 1,
                            minWidth: '32px',
                            height: '32px',
                            color: 'white',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.1)'
                            }
                          }}
                        >
                          <RemoveIcon sx={{ fontSize: '1.2rem' }} />
                        </IconButton>
                        
                        <Box
                          sx={{
                            position: 'relative',
                            height: '24px',
                            width: '24px',
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Typography
                            key={cartData.items.find(item => item.productId._id === id)?.quantity}
                            variant="body1"
                            sx={{
                              color: 'white',
                              fontWeight: 'bold',
                              fontSize: '1rem',
                              position: 'absolute',
                              '@keyframes slideUpNumber': {
                                '0%': {
                                  transform: 'translateY(100%)',
                                  opacity: 0
                                },
                                '100%': {
                                  transform: 'translateY(0)',
                                  opacity: 1
                                }
                              },
                              animation: 'slideUpNumber 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            }}
                          >
                            {cartData.items.find(item => item.productId._id === id)?.quantity || 0}
                          </Typography>
                        </Box>
                        
                        <IconButton
                          size="medium"
                          onClick={(e) => {
                            e.stopPropagation();
                            const currentQuantity = cartData?.items?.find(item => item.productId._id === id)?.quantity || 0;
                            runProtectedAction(async () => {
                              try {
                                await updateCartItem({ productId: id, quantity: currentQuantity + 1 }).unwrap();
                                toast.success(`Updated ${product.product.name} quantity`);
                              } catch (error) {
                                toast.error('Failed to update quantity');
                              }
                            });
                          }}
                          sx={{
                            p: 1,
                            minWidth: '32px',
                            height: '32px',
                            color: 'white',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.1)'
                            }
                          }}
                        >
                          <AddIcon sx={{ fontSize: '1.2rem' }} />
                        </IconButton>
                      </Box>
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
                  fontSize: '0.875rem',
                  bgcolor: isProductInCart(id) ? 'primary.main' : 'primary.main',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  minWidth: isProductInCart(id) ? '180px' : '140px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  }
                }}
              >
                {isProductInCart(id) ? '' : 'Add to Cart'}
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