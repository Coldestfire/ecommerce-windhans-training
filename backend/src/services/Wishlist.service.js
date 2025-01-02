const { WishlistModel } = require('../models')
const { ProductModel } = require('../models')
const ApiError = require('../utils/ApiError')

class WishlistService {
    static async createWishlist(userId) {
        const existingWishlist = await WishlistModel.findOne({ userId });

        if (existingWishlist) {
            return existingWishlist;
        }

        const wishlist = await WishlistModel.create({
            userId,
            items: []
        });

        return wishlist;
    }

    static async addToWishlist(userId, productId) {
        // Find user's wishlist or create new one
        let wishlist = await WishlistModel.findOne({ userId });
        if (!wishlist) {
            wishlist = await this.createWishlist(userId);
        }

        // Check product existence
        const product = await ProductModel.findById(productId);
        if (!product) {
            throw new ApiError(404, "Product not found");
        }

        // Check if product already in wishlist
        const existingItem = wishlist.items.find(
            item => item.productId?.toString() === productId
        );

        if (!existingItem) {
            // Add new item with the correct structure
            wishlist.items.push({
                productId: productId,
                addedAt: new Date()
            });
        }

        await wishlist.save();
        return wishlist;
    }

    static async getWishlist(userId) {
        const wishlist = await WishlistModel.findOne({ userId })
            .populate({
                path: 'items.productId',
                model: 'Product'
            });
        return wishlist;
    }

    static async removeFromWishlist(userId, productId) {
        const wishlist = await WishlistModel.findOne({ userId });
        if (!wishlist) {
            throw new ApiError(404, "Wishlist not found");
        }

        wishlist.items = wishlist.items.filter(
            item => item.productId.toString() !== productId
        );

        await wishlist.save();
        return wishlist;
    }
}

module.exports = WishlistService;
