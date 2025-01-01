import { Card, CardContent, CardMedia, Typography, Grid, CardActionArea, Box, Container } from "@mui/material";
import { useGetEveryProductQuery } from "../../provider/queries/Products.query";
import ProductRating from '../../components/Rating';
import { useNavigate } from "react-router-dom";
import CardSkeleton from "../../components/CardSkeleton";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import IconButton from '@mui/material/IconButton';
import NewProductsCarousel from './components/NewProductsCarousel';
import { useAddToCartMutation } from "../../provider/queries/Cart.query";
import { toast } from "react-toastify";

const ProductsLanding = () => {
  const { data, error, isLoading } = useGetEveryProductQuery({});
  const [addToCart] = useAddToCartMutation();
  const navigate = useNavigate();

  const handleAddToCart = async (e: React.MouseEvent, productId: string) => {
    e.stopPropagation(); // Prevent navigation when clicking the cart button
    try {
      await addToCart({ productId, quantity: 1 }).unwrap();
      toast.success('Product added to cart');
    } catch (error) {
      toast.error('Failed to add product to cart');
    }
  };

  if (isLoading) return <CardSkeleton />;
  if (error) return <div className="text-center p-4 text-red-500">{error.message}</div>;

  // Get the 3 newest products
  const newestProducts = data?.data?.slice(0, 3) || [];

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

      <Grid container spacing={3}>
        {data?.data?.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
            <Card
              sx={{
                height: '100%',
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
                    ₹{product.price.toFixed(2)}
                  </Typography>
                </Box>

                {/* Action Buttons - Fixed Height */}
                <Box sx={{ 
                  height: '40px', // Fixed height for buttons
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mt: 'auto' // Push to bottom
                }}>
                  <IconButton 
                    onClick={(e) => handleAddToCart(e, product._id)}
                    color="primary" 
                    size="small"
                    sx={{ 
                      '&:hover': { 
                        backgroundColor: 'rgba(25, 118, 210, 0.04)' 
                      } 
                    }}
                  >
                    <ShoppingCartIcon />
                  </IconButton>
                  <IconButton 
                    onClick={(e) => handleAddToWishlist(e, product._id)}
                    size="small"
                    sx={{ 
                      '&:hover': { 
                        backgroundColor: 'rgba(244, 67, 54, 0.04)' 
                      } 
                    }}
                  >
                    <FavoriteIcon color="error" />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ProductsLanding;