import { Box, Container, Typography, Button, Grid, Card, CardContent, CardMedia, IconButton } from "@mui/material";
import { useGetCartQuery, useRemoveFromCartMutation, useUpdateCartItemMutation } from "../../provider/queries/Cart.query";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { toast } from "react-toastify";

const CartPage = () => {
  const { data: cart, isLoading } = useGetCartQuery();
  const [removeFromCart] = useRemoveFromCartMutation();
  const [updateCartItem] = useUpdateCartItemMutation();

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
                    <Typography variant="body1" color="primary">₹{item.price}</Typography>
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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography>Total:</Typography>
                  <Typography variant="h6">₹{cart?.totalPrice}</Typography>
                </Box>
                <Button variant="contained" fullWidth>
                  Proceed to Checkout
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