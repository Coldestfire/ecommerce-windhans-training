import { useNavigate, useParams } from 'react-router-dom';
import { useGetAllProductsQuery } from '../../provider/queries/Products.query';
import { Grid, Card, CardActionArea, CardMedia, CardContent, Typography, Rating, Box, Button } from '@mui/material';
import { useState } from 'react';
import CardSkeleton from '../../components/CardSkeleton';

const ProductCategory = () => {
  const { category } = useParams(); // Get the category from the URL
  const { data, error, isLoading } = useGetAllProductsQuery({ category });
  const navigate = useNavigate();
  const [value, setValue] = useState<number | null>(2); // Rating value

  // Show loading state
  if (isLoading) {
    return (
        <CardSkeleton />
    );
  }

  // Show error message if fetching fails
  if (error) {
    return <div className="text-center p-4 text-red-500">{error.message}</div>;
  }

  return (
    <>
      
      {/* Category title */}
      <div className="mt-">
        <div className="mt-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        {category.charAt(0).toUpperCase() + category.slice(1)}
        </h2>
      </div>
      {/* Back Button */}
      <div>
          <Button label="Back" icon="pi pi-chevron-left" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>
      

        {/* If no products, show a "No products" message */}
        {data?.data?.length === 0 ? (
          <Typography variant="h6" color="textSecondary" align="center">
            No products available in this category.
          </Typography>
        ) : (
          <Grid container spacing={4} justifyContent="flex-start" sx={{ mt: 4, px: 2 }}>
            {data?.data?.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                <Card
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.05)', // Slight zoom on hover for a better effect
                      boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                    },
                  }}
                >
                  <CardActionArea onClick={() => navigate(`/product/${product._id}`)} sx={{ height: '100%' }}>
                    {/* Product Image */}
                    <CardMedia
                      component="img"
                      height="200"
                      image={product.image}
                      alt={product.name}
                      sx={{
                        objectFit: 'cover',
                        borderRadius: 2,
                        transition: 'transform 0.3s ease-in-out',
                      }}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      {/* Product Name */}
                      <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: '#333' }}>
                        {product.name}
                      </Typography>

                      {/* Rating and Price */}
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', mt: 2 }}>
                        {/* Rating */}
                        <Rating name="read-only" value={value} readOnly sx={{ fontSize: '1.2rem' }} />
                        
                        {/* Product Price */}
                        <Typography variant="h6" component="p" sx={{ fontWeight: 'bold', mt: 1 }}>
                          &#8377;{product.price.toFixed(2)}
                        </Typography>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </div>
    </>
  );
};

export default ProductCategory;
