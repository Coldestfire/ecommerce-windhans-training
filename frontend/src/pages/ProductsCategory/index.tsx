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
  Button
} from '@mui/material';
import ProductRating from '../../components/Rating';
import CardSkeleton from '../../components/CardSkeleton';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ProductCategory = () => {
  const { category } = useParams();
  const { data, error, isLoading } = useGetAllProductsQuery({ category });
  const navigate = useNavigate();

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
                      ₹{product.price.toFixed(2)}
                    </Typography>
                  </Box>

                  <Box sx={{ 
                    height: '40px',
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mt: 'auto'
                  }}>
                    <IconButton 
                      color="primary" 
                      size="small"
                      sx={{ '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.04)' } }}
                    >
                      <ShoppingCartIcon />
                    </IconButton>
                    <IconButton 
                      size="small"
                      sx={{ '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.04)' } }}
                    >
                      <FavoriteIcon color="error" />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default ProductCategory;