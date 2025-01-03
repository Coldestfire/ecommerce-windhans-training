import { Box, Container, Typography, Card, CardContent, Grid, Chip } from '@mui/material';
import { useGetOrdersQuery } from '../../provider/queries/Order.query';
import { formatIndianPrice } from '../../themes/formatPrices';
import { format } from 'date-fns';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'success';
    case 'pending':
      return 'warning';
    case 'failed':
      return 'error';
    default:
      return 'default';
  }
};

const OrdersPage = () => {
  const { data: orders, isLoading } = useGetOrdersQuery();

  if (isLoading) {
    return (
      <Container>
        <Typography>Loading orders...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        My Orders
      </Typography>

      <Grid container spacing={3}>
        {orders?.map((order) => (
          <Grid item xs={12} key={order._id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Order ID
                    </Typography>
                    <Typography>{order._id}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Date
                    </Typography>
                    <Typography>
                      {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Total Amount
                    </Typography>
                    <Typography variant="h6" color="primary.main">
                      {formatIndianPrice(order.totalAmount)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                      Status
                    </Typography>
                    <Chip
                      label={order.status.toUpperCase()}
                      color={getStatusColor(order.status) as any}
                      size="small"
                    />
                  </Box>
                </Box>

                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                    Order Items ({order.products.length} items)
                  </Typography>
                  {order.products.map((item) => (
                    <Box
                      key={item.product._id}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2,
                        pb: 2,
                        borderBottom: '1px solid #eee',
                        '&:last-child': {
                          borderBottom: 'none',
                          pb: 0,
                          mb: 0,
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flex: 1 }}>
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          style={{
                            width: 80,
                            height: 80,
                            objectFit: 'contain',
                            borderRadius: '8px',
                            border: '1px solid #eee',
                          }}
                        />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                            {item.product.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Price per item: {formatIndianPrice(item.price)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Quantity: {item.quantity}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ textAlign: 'right', minWidth: '120px' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                          {formatIndianPrice(item.price * item.quantity)}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                  <Box sx={{ 
                    mt: 3, 
                    pt: 2, 
                    borderTop: '1px solid #eee',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 3
                  }}>
                    <Typography variant="subtitle1" color="text.secondary">
                      Total Amount:
                    </Typography>
                    <Typography variant="h6" color="primary.main" sx={{ fontWeight: 'bold' }}>
                      {formatIndianPrice(order.totalAmount)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default OrdersPage; 