import { useEffect } from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const SuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = location.state?.orderId;

  useEffect(() => {
    if (!orderId) {
      navigate('/');
    }
  }, [orderId, navigate]);

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
          textAlign: 'center',
          gap: 3
        }}
      >
        <CheckCircleOutlineIcon sx={{ fontSize: 80, color: 'success.main' }} />
        <Typography variant="h4" gutterBottom>
          Payment Successful!
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Thank you for your purchase. Your order has been successfully placed.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Order ID: {orderId}
        </Typography>
        <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
          <Button variant="contained" onClick={() => navigate('/orders')}>
            View Orders
          </Button>
          <Button variant="outlined" onClick={() => navigate('/')}>
            Continue Shopping
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default SuccessPage; 