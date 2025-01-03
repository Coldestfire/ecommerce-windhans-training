const { CartModel, ProductModel } = require('../models');
const ApiError = require("../utils/ApiError");

class CartService {
    static async createCart(userId) {
        const existingCart = await CartModel.findOne({ 
            userId, 
            status: 'pending' 
        });

        if (existingCart) {
            return existingCart;
        }

        const cart = await CartModel.create({
            userId,
            items: [],
            totalPrice: 0
        });

        return cart;
    }

    static async addToCart(userId, productId, quantity) {
        // Find user's pending cart or create new one
        let cart = await CartModel.findOne({ userId, status: 'pending' });
        if (!cart) {
            cart = await this.createCart(userId);
        }

        // Check product existence and stock
        const product = await ProductModel.findById(productId);
        if (!product) {
            throw new ApiError(404, "Product not found");
        }
        if (product.stock < quantity) {
            throw new ApiError(400, "Insufficient stock");
        }

        // Check if product already in cart
        const existingItemIndex = cart.items.findIndex(
            item => item.productId.toString() === productId
        );

        if (existingItemIndex > -1) {
            // Update existing item quantity
            const newQuantity = cart.items[existingItemIndex].quantity + quantity;
            if (product.stock < newQuantity) {
                throw new ApiError(400, "Insufficient stock");
            }
            cart.items[existingItemIndex].quantity = newQuantity;
        } else {
            // Add new item
            cart.items.push({
                productId,
                quantity,
                price: product.price
            });
        }

        // Update total price
        cart.totalPrice = cart.items.reduce(
            (total, item) => total + (item.price * item.quantity), 
            0
        );

        await cart.save();
        return cart;
    }

    static async getCart(userId) {
        let cart = await CartModel.findOne({ userId, status: 'pending' })
            .populate('items.productId');

        if (cart) {
            // Filter out items with null productId
            const validItems = cart.items.filter(item => item.productId !== null);
            
            // If items were filtered out, update the cart and recalculate total price
            if (validItems.length !== cart.items.length) {
                cart.items = validItems;
                cart.totalPrice = validItems.reduce(
                    (total, item) => total + (item.price * item.quantity),
                    0
                );
                await cart.save();
            }
        }

        return cart;
    }

    static async updateCartItem(userId, productId, quantity) {
        const cart = await CartModel.findOne({ userId, status: 'pending' });
        if (!cart) {
            throw new ApiError(404, "Cart not found");
        }

        const product = await ProductModel.findById(productId);
        if (!product) {
            throw new ApiError(404, "Product not found");
        }
        if (product.stock < quantity) {
            throw new ApiError(400, "Insufficient stock");
        }

        const itemIndex = cart.items.findIndex(
            item => item.productId.toString() === productId
        );
        if (itemIndex === -1) {
            throw new ApiError(404, "Product not found in cart");
        }

        cart.items[itemIndex].quantity = quantity;
        cart.totalPrice = cart.items.reduce(
            (total, item) => total + (item.price * item.quantity), 
            0
        );

        await cart.save();
        return cart;
    }

    static async removeFromCart(userId, productId) {
        const cart = await CartModel.findOne({ userId, status: 'pending' });
        if (!cart) {
            throw new ApiError(404, "Cart not found");
        }

        cart.items = cart.items.filter(
            item => item.productId.toString() !== productId
        );
        cart.totalPrice = cart.items.reduce(
            (total, item) => total + (item.price * item.quantity), 
            0
        );

        await cart.save();
        return cart;
    }

    static async checkoutCart(userId) {
        const cart = await CartModel.findOne({ userId, status: 'pending' });
        if (!cart) {
            throw new ApiError(404, "Cart not found");
        }
        if (cart.items.length === 0) {
            throw new ApiError(400, "Cart is empty");
        }

        // Update product stock and verify stock availability
        const stockUpdates = [];
        for (const item of cart.items) {
            const product = await ProductModel.findById(item.productId);
            if (!product) {
                throw new ApiError(404, `Product ${item.productId} not found`);
            }
            if (product.stock < item.quantity) {
                throw new ApiError(400, `Insufficient stock for ${product.name}`);
            }
            
            stockUpdates.push({
                updateOne: {
                    filter: { _id: item.productId },
                    update: { $inc: { stock: -item.quantity } }
                }
            });
        }

        // Execute all stock updates in a transaction
        const session = await CartModel.startSession();
        try {
            await session.withTransaction(async () => {
                await ProductModel.bulkWrite(stockUpdates, { session });
                cart.status = 'completed';
                await cart.save({ session });
            });
        } catch (error) {
            throw new ApiError(500, "Checkout failed");
        } finally {
            await session.endSession();
        }

        return cart;
    }

    static async clearCart(userId) {
        try {
            const cart = await CartModel.findOneAndUpdate(
                { userId },
                { 
                    $set: { 
                        items: [],
                        totalPrice: 0
                    }
                },
                { new: true }
            );

            if (!cart) {
                throw new ApiError(404, 'Cart not found');
            }

            return cart;
        } catch (error) {
            throw new ApiError(500, 'Failed to clear cart');
        }
    }
}

module.exports = CartService;