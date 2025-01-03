import { useEffect, useState } from 'react';
import { Box, Container, Typography, Button, Card, CardContent, Grid, Divider } from '@mui/material';
import { useGetCartQuery } from '../../provider/queries/Cart.query';
import { formatIndianPrice } from '../../themes/formatPrices';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useCreateOrderMutation, useVerifyPaymentMutation } from '../../provider/queries/Payment.query';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const CheckoutPage = () => {
  const { data: cart } = useGetCartQuery();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [createOrder] = useCreateOrderMutation();
  const [verifyPayment] = useVerifyPaymentMutation();

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const order = await createOrder(cart?.totalPrice || 0).unwrap();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: cart?.totalPrice * 100,
        currency: 'INR',
        name: 'Your Store Name',
        description: 'Purchase Description',
        order_id: order.razorpayOrderId,
        handler: async (response: any) => {
          try {
            const result = await verifyPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            }).unwrap();

            if (result.success) {
              toast.success('Payment successful!');
              navigate('/orders');
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: 'Customer Name',
          email: 'customer@example.com',
          contact: 'Customer Phone',
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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        Checkout
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Order Items
              </Typography>
              <Box sx={{ mb: 2 }}>
                {cart?.items?.map((item) => (
                  <Box
                    key={item.productId._id}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 2,
                      pb: 2,
                      borderBottom: '1px solid #eee',
                    }}
                  >
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <img
                        src={item.productId.images[0]}
                        alt={item.productId.name}
                        style={{
                          width: 60,
                          height: 60,
                          objectFit: 'contain',
                        }}
                      />
                      <Box>
                        <Typography variant="body1">
                          {item.productId.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Quantity: {item.quantity}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      {formatIndianPrice(item.price * item.quantity)}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Order Summary
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography color="text.secondary">Subtotal</Typography>
                  <Typography>{formatIndianPrice(cart?.totalPrice || 0)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography color="text.secondary">Shipping</Typography>
                  <Typography color="success.main">Free</Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6" color="primary.main">
                  {formatIndianPrice(cart?.totalPrice || 0)}
                </Typography>
              </Box>

              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handlePayment}
                disabled={loading || !cart?.items?.length}
              >
                {loading ? 'Processing...' : 'Pay Now'}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CheckoutPage; 