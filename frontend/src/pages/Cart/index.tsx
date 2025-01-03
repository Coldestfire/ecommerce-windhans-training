import { useEffect, useState } from 'react';
import { Box, Container, Typography, Button, Grid, Card, CardContent, CardMedia, IconButton, Divider } from "@mui/material";
import { useGetCartQuery, useRemoveFromCartMutation, useUpdateCartItemMutation, useClearCartMutation } from "../../provider/queries/Cart.query";
import { useCreatePaymentMutation, useVerifyPaymentMutation } from '../../provider/queries/Payment.query';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { toast } from "react-toastify";
import { formatIndianPrice } from "../../themes/formatPrices";
import { useNavigate } from "react-router-dom";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const CartPage = () => {
  const { data: cart, isLoading } = useGetCartQuery();
  const [removeFromCart] = useRemoveFromCartMutation();
  const [updateCartItem] = useUpdateCartItemMutation();
  const [clearCart] = useClearCartMutation();
  const [createPayment] = useCreatePaymentMutation();
  const [verifyPayment] = useVerifyPaymentMutation();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleUpdateQuantity = async (productId: string, currentQuantity: number, increment: boolean) => {
    const newQuantity = increment ? currentQuantity + 1 : currentQuantity - 1;
    if (newQuantity < 1) return;

    try {
      await updateCartItem({ productId, quantity: newQuantity }).unwrap();
    } catch (error) {   
      toast.error('Failed to update quantity');
    }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      await removeFromCart(productId).unwrap();
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const handlePayment = async () => {
    if (!cart?.totalPrice) {
      toast.error('Invalid cart total');
      return;
    }

    setLoading(true);
    try {
      const order = await createPayment(cart.totalPrice).unwrap();
      
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: cart.totalPrice * 100,
        currency: 'INR',
        name: 'Your Store Name',
        description: 'Purchase Description',
        order_id: order.id,
        handler: async (response: any) => {
          try {
            const result = await verifyPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            }).unwrap();

            if (result.success) {
              await clearCart().unwrap();
              toast.success('Payment successful!');
              navigate('/payment-success', { state: { orderId: order.orderId } });
            }
          } catch (error) {
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: 'Customer Name',
          email: 'customer@example.com',
          contact: '9999999999',
        },
        theme: {
          color: '#1976d2',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error('Failed to initiate payment');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>Shopping Cart</Typography>
      
      {cart?.items?.length === 0 ? (
        <Typography>Your cart is empty</Typography>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            {cart?.items?.map((item) => (
              <Card key={item.productId._id} sx={{ mb: 2, display: 'flex' }}>
                <CardMedia
                  component="img"
                  sx={{ width: 150, objectFit: 'contain', p: 2 }}
                  image={item.productId.images[0]}
                  alt={item.productId.name}
                />
                <CardContent sx={{ flex: 1, display: 'flex', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h6">{item.productId.name}</Typography>
                    <Typography variant="body1" color="primary">
                      {formatIndianPrice(item.price)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton onClick={() => handleUpdateQuantity(item.productId._id, item.quantity, false)}>
                      <RemoveIcon />
                    </IconButton>
                    <Typography>{item.quantity}</Typography>
                    <IconButton onClick={() => handleUpdateQuantity(item.productId._id, item.quantity, true)}>
                      <AddIcon />
                    </IconButton>
                    <IconButton onClick={() => handleRemoveItem(item.productId._id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>Order Summary</Typography>
                
                {/* Product List */}
                <Box sx={{ mb: 2 }}>
                  {cart?.items?.map((item) => (
                    <Box 
                      key={item.productId._id} 
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        mb: 1,
                        minHeight: '24px',
                        alignItems: 'flex-start',
                        '&:not(:last-child)': {
                          borderBottom: '1px solid #eee',
                          pb: 1
                        }
                      }}
                    >
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: 'text.secondary',
                          maxWidth: '60%',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: 'vertical',
                          lineHeight: '1.5',
                          mt: '2px'
                        }}
                      >
                        {item.productId.name}
                      </Typography>
                      <Box sx={{ 
                        display: 'flex', 
                        gap: 1, 
                        alignItems: 'center',
                        flexShrink: 0
                      }}>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: 'text.secondary',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          × {item.quantity}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color="primary.main" 
                          sx={{ 
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {formatIndianPrice(item.price * item.quantity || 0)}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>

                {/* Total Items */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography color="text.secondary">Total Items:</Typography>
                  <Typography>
                    {cart?.items?.reduce((acc, item) => acc + item.quantity, 0)}
                  </Typography>
                </Box>

                {/* Total Amount */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  mb: 2,
                  pt: 1,
                  borderTop: '1px solid #eee'
                }}>
                  <Typography fontWeight="bold">Total Amount:</Typography>
                  <Typography variant="h6" color="primary.main">
                    {cart?.totalPrice ? formatIndianPrice(cart.totalPrice) : formatIndianPrice(0)}
                  </Typography>
                </Box>

                <Button 
                  variant="contained" 
                  fullWidth
                  onClick={handlePayment}
                  disabled={loading || !cart?.items?.length}
                  sx={{
                    py: 1.5,
                    textTransform: 'none',
                    fontSize: '1rem'
                  }}
                >
                  {loading ? 'Processing...' : 'Pay Now'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default CartPage;