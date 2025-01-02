const CatchAsync = require("../utils/CatchAsync");
const WishlistService = require("../services/Wishlist.service");

class WishlistController {
    static createWishlist = CatchAsync(async (req, res) => {
        const wishlist = await WishlistService.createWishlist(req.user);
        return res.status(201).json(wishlist);
    });

    static addToWishlist = CatchAsync(async (req, res) => {
        const { productId } = req.body;
        console.log("from controller wishlist :",req.user, productId);
        const wishlist = await WishlistService.addToWishlist(req.user, productId);
        return res.status(200).json(wishlist);
    });

    static getWishlist = CatchAsync(async (req, res) => {
        const wishlist = await WishlistService.getWishlist(req.user);
        return res.status(200).json(wishlist);
    });

    static removeFromWishlist = CatchAsync(async (req, res) => {
        const wishlist = await WishlistService.removeFromWishlist(req.user, req.params.productId);
        return res.status(200).json(wishlist);
    });
}

module.exports = WishlistController; 