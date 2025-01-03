const Order = require('../models/order.models');
const Cart = require('../models/cart.models');
const ApiError = require('../utils/ApiError');

class OrderService {
  static async createOrderFromCart(userId, razorpayOrderId, razorpayPaymentId, razorpaySignature) {
    const cart = await Cart.findOne({ userId, status: 'pending' }).populate('items.productId');
    
    if (!cart || cart.items.length === 0) {
      throw new ApiError(404, 'Cart not found or empty');
    }

    const orderProducts = cart.items.map(item => ({
      product: item.productId._id,
      quantity: item.quantity,
      price: item.price
    }));

    const order = await Order.create({
      user: userId,
      products: orderProducts,
      totalAmount: cart.totalPrice,
      status: 'processing',
      paymentStatus: 'completed',
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    });

    return order;
  }
}

module.exports = OrderService; 