const CatchAsync = require("../utils/CatchAsync");
const CartService = require("../services/Cart.service");

class CartController {
    static createCart = CatchAsync(async (req, res) => {
        const cart = await CartService.createCart(req.user);
        return res.status(201).json(cart);
    });

    static addToCart = CatchAsync(async (req, res) => {
        const { productId, quantity } = req.body;
        const cart = await CartService.addToCart(req.user, productId, quantity);
        return res.status(200).json(cart);
    });

    static getCart = CatchAsync(async (req, res) => {
        const cart = await CartService.getCart(req.user);
        return res.status(200).json(cart);
    });

    static updateCartItem = CatchAsync(async (req, res) => {
        const { productId, quantity } = req.body;
        const cart = await CartService.updateCartItem(req.user, productId, quantity);
        return res.status(200).json(cart);
    });

    static removeFromCart = CatchAsync(async (req, res) => {
        const cart = await CartService.removeFromCart(req.user, req.params.productId);
        return res.status(200).json(cart);
    });

    static checkoutCart = CatchAsync(async (req, res) => {
        const cart = await CartService.checkoutCart(req.user);
        return res.status(httpStatus200).json(cart);
    });

    static clearCart = CatchAsync(async (req, res) => {
        const cart = await CartService.clearCart(req.user);
        res.status(200).json(cart);
    });
}

module.exports = CartController;