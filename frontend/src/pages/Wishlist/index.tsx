import { Container, Typography, Grid, Card, CardMedia, CardContent, Box, IconButton, CardActionArea } from "@mui/material";
import { useGetWishlistQuery, useRemoveFromWishlistMutation } from "../../provider/queries/Wishlist.query";
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from "react-toastify";
import { formatIndianPrice } from "../../themes/formatPrices";
import { useNavigate } from "react-router-dom";

const WishlistPage = () => {
  const { data: wishlist, isLoading } = useGetWishlistQuery();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  const navigate = useNavigate();

  const handleRemoveItem = async (productId: string) => {
    try {
      await removeFromWishlist(productId).unwrap();
      toast.success('Item removed from wishlist');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>My Wishlist</Typography>
      
      {wishlist?.items?.length === 0 ? (
        <Typography>Your wishlist is empty</Typography>
      ) : (
        <Grid container spacing={3}>
          {wishlist?.items?.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.productId._id}>
              <Card sx={{
                height: '103%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
                },
                borderRadius: 2,
                overflow: 'hidden',
              }}>
                <CardActionArea onClick={() => navigate(`/product/${item.productId._id}`)}>
                  <CardMedia
                    component="img"
                    image={item.productId.images[0]}
                    alt={item.productId.name}
                    sx={{
                      height: 200,
                      objectFit: 'contain',
                      backgroundColor: '#f5f5f5',
                      p: 2
                    }}
                  />
                </CardActionArea>

                <CardContent sx={{ 
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  height: '180px',
                }}>
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
                      {item.productId.name}
                    </Typography>
                  </Box>

                  <Box sx={{ 
                    height: '32px',
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
                      {formatIndianPrice(item.productId.price)}
                    </Typography>
                  </Box>

                  <Box sx={{ 
                    height: '40px',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    mt: 'auto'
                  }}>
                    <IconButton 
                      onClick={() => handleRemoveItem(item.productId._id)}
                      color="error"
                      size="small"
                    >
                      <DeleteIcon />
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

export default WishlistPage;
