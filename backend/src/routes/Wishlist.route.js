const express = require('express');
const router = express.Router();
const WishlistController = require('../controllers/Wishlist.controller');
const Authentication = require("../middlewares/Authentication");

// Apply authentication middleware to all wishlist routes
router.use(Authentication);

// Wishlist routes
router.post('/', WishlistController.createWishlist);
router.get('/', WishlistController.getWishlist);
router.post('/add', WishlistController.addToWishlist);
router.delete('/remove/:productId', WishlistController.removeFromWishlist);

module.exports = router;