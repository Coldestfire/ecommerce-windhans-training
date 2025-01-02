import { useNavigate, useParams } from 'react-router-dom';
import { useGetAllProductsQuery } from '../../provider/queries/Products.query';
import { 
  Grid, 
  Card, 
  CardActionArea, 
  CardMedia, 
  CardContent, 
  Typography, 
  Box, 
  Container,
  IconButton,
  Button,
  Stack,
  Pagination
} from '@mui/material';
import ProductRating from '../../components/Rating';
import CardSkeleton from '../../components/CardSkeleton';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import { useAddToCartMutation, useUpdateCartItemMutation, useGetCartQuery } from '../../provider/queries/Cart.query';
import { useAddToWishlistMutation, useGetWishlistQuery, useRemoveFromWishlistMutation } from '../../provider/queries/Wishlist.query';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { formatIndianPrice } from '../../themes/formatPrices';

const ProductCategory = () => {
  const { category } = useParams();
  const [page, setPage] = useState(1);
  const { data, error, isLoading } = useGetAllProductsQuery({ category, page });
  const navigate = useNavigate();

  // Cart and Wishlist mutations
  const [addToCart] = useAddToCartMutation();
  const [updateCartItem] = useUpdateCartItemMutation();
  const { data: cartData } = useGetCartQuery();
  const [addToWishlist] = useAddToWishlistMutation();
  const { data: wishlistData } = useGetWishlistQuery();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();

  const isProductInCart = (productId: string) => {
    return cartData?.items?.some(item => item?.productId?._id === productId) || false;
  };
  
  const isProductInWishlist = (productId: string) => {
    return wishlistData?.items?.some(item => item?.productId?._id === productId) || false;
  };

  const handleAddToCart = async (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    try {
      if (isProductInCart(productId)) {
        const cartItem = cartData?.items?.find(item => item?.productId?._id === productId);
        if (cartItem) {
          await updateCartItem({ productId, quantity: cartItem.quantity + 1 }).unwrap();
          toast.success(`Added another ${cartItem.productId.name} to cart`, {
            position: "top-left",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      } else {
        await addToCart({ productId, quantity: 1 }).unwrap();
        const productName = data?.data?.find(p => p._id === productId)?.name;
        toast.success(`${productName} added to cart`, {
          position: "top-left",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      toast.error('Failed to update cart', {
        position: "bottom-left",
        autoClose: 2000,
      });
    }
  };

  const handleAddToWishlist = async (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
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
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalPages = data?.totalPages || 1;

  if (isLoading) return <CardSkeleton />;
  if (error) return <div className="text-center p-4 text-red-500">{error.message}</div>;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: 4,
        gap: 2
      }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{
            color: 'text.secondary',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
            textTransform: 'none',
            fontWeight: 500
          }}
        >
          Back
        </Button>
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            fontWeight: 'bold',
            color: '#1a237e',
            flex: 1,
            textAlign: 'center'
          }}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </Typography>
        <Box sx={{ width: 100 }} /> {/* Spacer for alignment */}
      </Box>

      {data?.data?.length === 0 ? (
        <Typography variant="h6" color="textSecondary" align="center">
          No products available in this category.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {data?.data?.map((product) => (
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

                <CardContent 
                  sx={{ 
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    height: '180px',
                  }}
                >
                  <Box sx={{ 
                    minHeight: '48px',
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

                  <Box sx={{ height: '24px', display: 'flex', alignItems: 'center' }}>
                    <ProductRating id={product._id} />
                  </Box>

                  <Box sx={{ height: '32px', display: 'flex', alignItems: 'center' }}>
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                      {formatIndianPrice(product.price)}
                    </Typography>
                  </Box>

                  <Box sx={{ 
                    height: '40px',
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mt: 'auto'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconButton 
                        onClick={(e) => handleAddToCart(e, product._id)}
                        color="primary" 
                        size="small"
                        sx={{ 
                          bgcolor: isProductInCart(product._id) ? 'primary.light' : 'transparent',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          borderRadius: '12px',
                          padding: '8px 12px',
                          width: isProductInCart(product._id) ? '80px' : '40px',
                          '&:hover': { 
                            backgroundColor: isProductInCart(product._id) 
                              ? 'primary.light' 
                              : 'rgba(25, 118, 210, 0.04)' 
                          }
                        }}
                      >
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 0.5,
                          padding: '2px 4px',
                          borderRadius: '8px',
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
                            <AddIcon sx={{ 
                              color: 'white',
                              fontSize: '1.2rem',
                              opacity: 1,
                              transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                              transform: 'scale(1)',
                              animation: 'fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                            }} />
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
      )}

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

export default ProductCategory;