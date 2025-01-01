const express = require('express');
const router = express.Router();
const CartController = require('../controllers/Cart.controller');
const Authentication = require("../middlewares/Authentication");

// Apply authentication middleware to all cart routes
router.use(Authentication);

// Cart routes
router.post('/', CartController.createCart);
router.get('/', CartController.getCart);
router.post('/add', CartController.addToCart);
router.patch('/update', CartController.updateCartItem);
router.delete('/remove/:productId', CartController.removeFromCart);
router.post('/checkout', CartController.checkoutCart);

module.exports = router;