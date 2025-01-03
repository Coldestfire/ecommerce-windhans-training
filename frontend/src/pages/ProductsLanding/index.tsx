import { Card, CardContent, CardMedia, Typography, Grid, CardActionArea, Box, Container } from "@mui/material";
import { useGetEveryProductQuery } from "../../provider/queries/Products.query";
import ProductRating from '../../components/Rating';
import { useNavigate } from "react-router-dom";
import CardSkeleton from "../../components/CardSkeleton";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import IconButton from '@mui/material/IconButton';
import NewProductsCarousel from './components/NewProductsCarousel';
import { useAddToCartMutation, useUpdateCartItemMutation, useRemoveFromCartMutation } from "../../provider/queries/Cart.query";
import { toast } from "react-toastify";
import { formatIndianPrice } from "../../themes/formatPrices";
import { useGetCartQuery } from "../../provider/queries/Cart.query";
import AddIcon from '@mui/icons-material/Add';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAddToWishlistMutation, useGetWishlistQuery, useRemoveFromWishlistMutation } from "../../provider/queries/Wishlist.query";
import { useState } from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { useProtectedAction } from '../../hooks/useProtectedAction';
import { useAuth } from '../../hooks/useAuth';
import RemoveIcon from '@mui/icons-material/Remove';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';

interface GetAllProductsResponse {
  data: Product[];
  total: number;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
}

const ProductsLanding = () => {
  const [page, setPage] = useState(1);
  const { data, error, isLoading } = useGetEveryProductQuery({ page });
  const { data: carasoulData } = useGetEveryProductQuery({ page: 1 });
  const { isAuthenticated } = useAuth();
  const [addToCart] = useAddToCartMutation();
  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeFromCart] = useRemoveFromCartMutation();
  const { data: cartData } = useGetCartQuery(undefined, { 
    skip: !isAuthenticated 
  });
  const navigate = useNavigate();
  const [addToWishlist] = useAddToWishlistMutation();
  const { data: wishlistData } = useGetWishlistQuery(undefined, { 
    skip: !isAuthenticated 
  });
  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  const runProtectedAction = useProtectedAction();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = data?.data?.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to check if product is in cart
  const isProductInCart = (productId: string) => {
    if (!isAuthenticated) return false;
    return cartData?.items?.some(item => item.productId._id === productId);
  };

  const isProductInWishlist = (productId: string) => {
    if (!isAuthenticated) return false;
    return wishlistData?.items?.some(item => item.productId._id === productId);
  };

  const handleAddToCart = async (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    runProtectedAction(async () => {
      try {
        if (isProductInCart(productId)) {
          const cartItem = cartData?.items?.find(item => item.productId._id === productId);
          if (cartItem) {
            await updateCartItem({ productId, quantity: cartItem.quantity + 1 }).unwrap();
            toast.success(`Added another ${cartItem.productId.name} to cart`);
          }
        } else {
          await addToCart({ productId, quantity: 1 }).unwrap();
          const productName = data?.data?.find(p => p._id === productId)?.name;
          toast.success(`${productName} added to cart`);
        }
      } catch (error) {
        toast.error('Failed to update cart');
      }
    });
  };

  const handleAddToWishlist = async (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    runProtectedAction(async () => {
      try {
        if (isProductInWishlist(productId)) {
          await removeFromWishlist(productId).unwrap();
          const productName = data?.data?.find(p => p._id === productId)?.name;
          toast.success(`${productName} removed from wishlist`);
        } else {
          await addToWishlist(productId).unwrap();
          const productName = data?.data?.find(p => p._id === productId)?.name;
          toast.success(`${productName} added to wishlist`);
        }
      } catch (error) {
        toast.error('Failed to update wishlist');
      }
    });
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateQuantity = async (e: React.MouseEvent, productId: string, newQuantity: number) => {
    e.stopPropagation();
    runProtectedAction(async () => {
      try {
        await updateCartItem({ productId, quantity: newQuantity }).unwrap();
        const productName = data?.data?.find(p => p._id === productId)?.name;
        toast.success(`Updated ${productName} quantity`);
      } catch (error) {
        toast.error('Failed to update quantity');
      }
    });
  };

  const handleRemoveFromCart = async (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    runProtectedAction(async () => {
      try {
        await removeFromCart(productId).unwrap();
        const productName = data?.data?.find(p => p._id === productId)?.name;
        toast.success(`${productName} removed from cart`);
      } catch (error) {
        toast.error('Failed to remove from cart');
      }
    });
  };

  if (isLoading) return <CardSkeleton />;
  if (error) return <div className="text-center p-4 text-red-500">{error.message}</div>;

  // Get the 3 newest products
  const newestProducts = carasoulData?.data?.slice(0, 3) || [];

  const totalPages = data?.totalPages || 1;

  const paginationSection = (
    <Stack 
      spacing={2} 
      sx={{ 
        mt: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Pagination 
        count={totalPages}
        page={page}
        onChange={handlePageChange}
        color="primary"
        size="large"
        sx={{
          '& .MuiPaginationItem-root': {
            fontSize: '1rem',
          },
          '& .Mui-selected': {
            backgroundColor: 'primary.main',
            color: 'white',
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
          },
        }}
      />
    </Stack>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <NewProductsCarousel products={newestProducts} />

      <Typography 
        variant="h4" 
        component="h1" 
        sx={{ 
          mb: 4, 
          fontWeight: 'bold',
          color: '#1a237e',
          textAlign: { xs: 'center', md: 'left' }
        }}
      >
        Latest Products
      </Typography>
      <Box sx={{ mb: 4, display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            sx: {
              borderRadius: '12px',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(0, 0, 0, 0.1)',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(0, 0, 0, 0.2)',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: 'primary.main',
              }
            }
          }}
          sx={{
            maxWidth: '600px',
            margin: '0 auto',
          }}
        />
      </Box>
      <Grid container spacing={3}>
        {filteredProducts?.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
            <Card
              sx={{
                height: '106%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
                },
                borderRadius: 2,
                overflow: 'hidden',
              }}
            >
              {/* Image Section - Fixed Height */}
              <CardActionArea onClick={() => navigate(`/product/${product._id}`)}>
                <CardMedia
                  component="img"
                  image={product.images[0]}
                  alt={product.name}
                  sx={{
                    height: 200,
                    objectFit: 'contain',
                    backgroundColor: '#f5f5f5',
                    p: 2
                  }}
                />
              </CardActionArea>

              {/* Content Section - Fixed Layout */}
              <CardContent 
                sx={{ 
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  height: '180px', // Fixed height for content area
                }}
              >
                {/* Product Name - Fixed Height */}
                <Box sx={{ 
                  minHeight: '48px', // Fixed height for 2 lines of text
                  maxHeight: '48px',
                  mb: 1
                }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      lineHeight: '1.2',
                      fontSize: '1rem'
                    }}
                  >
                    {product.name}
                  </Typography>
                </Box>

                {/* Rating - Fixed Height */}
                <Box sx={{ 
                  height: '24px', // Fixed height for rating
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <ProductRating id={product._id} />
                </Box>

                {/* Price - Fixed Height */}
                <Box sx={{ 
                  height: '32px', // Fixed height for price
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <Typography 
                    variant="h6" 
                    color="primary" 
                    sx={{ 
                      fontWeight: 'bold',
                      fontSize: '1.1rem'
                    }}
                  >
                    {formatIndianPrice(product.price)}
                  </Typography>
                </Box>

                {/* Action Buttons - Fixed Height */}
                <Box sx={{ 
                  height: '40px',
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mt: 'auto',
                  
                  
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton 
                      onClick={(e) => handleAddToCart(e, product._id)}
                      color="primary" 
                      size="small"
                      sx={{ 
                        bgcolor: isProductInCart(product._id) ? 'primary.main' : 'transparent',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        borderRadius: '12px',
                        padding: '8px 12px',
                        width: isProductInCart(product._id) ? '120px' : '40px',
                        height: '36px',
                        overflow: 'hidden',
                        '&:hover': { 
                          backgroundColor: isProductInCart(product._id) 
                            ? 'primary.dark' 
                            : 'rgba(25, 118, 210, 0.08)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                        },
                        '&:active': {
                          transform: 'translateY(0)',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }
                      }}
                    >
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        gap: 1.5,
                        width: '100%',
                        justifyContent: isProductInCart(product._id) ? 'space-between' : 'center',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}>
                        <ShoppingCartIcon sx={{ 
                          color: isProductInCart(product._id) ? 'white' : 'primary.main',
                          transition: 'color 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          fontSize: '1.2rem'
                        }} />
                        {isProductInCart(product._id) && (
                          <Box 
                            sx={{ 
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                              '@keyframes expandIn': {
                                '0%': {
                                  width: '0',
                                  opacity: 0
                                },
                                '100%': {
                                  width: '65px',
                                  opacity: 1
                                }
                              },
                              animation: 'expandIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                              width: '65px'
                            }}
                          >
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                const currentQuantity = cartData?.items?.find(item => item.productId._id === product._id)?.quantity || 0;
                                if (currentQuantity > 1) {
                                  handleUpdateQuantity(e, product._id, currentQuantity - 1);
                                } else {
                                  handleRemoveFromCart(e, product._id);
                                }
                              }}
                              sx={{
                                p: 0,
                                minWidth: '20px',
                                color: 'white',
                                '&:hover': {
                                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                }
                              }}
                            >
                              <RemoveIcon sx={{ fontSize: '1rem' }} />
                            </IconButton>
                            
                            <Box
                              sx={{
                                position: 'relative',
                                height: '20px',
                                width: '20px',
                                overflow: 'hidden',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <Typography
                                key={cartData?.items?.find(item => item.productId._id === product._id)?.quantity}
                                variant="caption"
                                sx={{
                                  color: 'white',
                                  fontWeight: 'bold',
                                  fontSize: '0.875rem',
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
                                {cartData?.items?.find(item => item.productId._id === product._id)?.quantity || 0}
                              </Typography>
                            </Box>
                            
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                const currentQuantity = cartData?.items?.find(item => item.productId._id === product._id)?.quantity || 0;
                                handleUpdateQuantity(e, product._id, currentQuantity + 1);
                              }}
                              sx={{
                                p: 0,
                                minWidth: '20px',
                                color: 'white',
                                '&:hover': {
                                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                }
                              }}
                            >
                              <AddIcon sx={{ fontSize: '1rem' }} />
                            </IconButton>
                          </Box>
                        )}
                      </Box>
                    </IconButton>
                  </Box>
                  <IconButton 
                    onClick={(e) => handleAddToWishlist(e, product._id)}
                    size="small"
                    sx={{ 
                      bgcolor: isProductInWishlist(product._id) ? 'error.light' : 'transparent',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      padding: '5px',
                      paddingTop: '5px',
                      paddingLeft: '6px',
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      '&:hover': { 
                        backgroundColor: isProductInWishlist(product._id) 
                          ? 'error.light' 
                          : 'rgba(244, 67, 54, 0.04)',
                        transform: 'scale(1.1)',
                      } 
                    }}
                  >
                    <FavoriteIcon 
                      sx={{ 
                        color: isProductInWishlist(product._id) ? 'white' : 'error.main',
                        transition: 'color 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        fontSize: '1.8rem',
                        marginTop: '2px',
                        animation: isProductInWishlist(product._id) 
                          ? 'pulse 0.3s cubic-bezier(0.4, 0, 0.2, 1)' 
                          : 'none',
                      }} 
                    />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>


      {paginationSection}
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
    </Container>
  );
};

export default ProductsLanding;