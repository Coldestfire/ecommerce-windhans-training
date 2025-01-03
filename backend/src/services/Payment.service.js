const Razorpay = require('razorpay');
const crypto = require('crypto');
const ApiError = require('../utils/ApiError');
const Order = require('../models/order.models');
const Cart = require('../models/cart.models');
require('dotenv').config();

class PaymentService {
  // Initialize Razorpay
  static razorpay = new Razorpay({
    key_id: "rzp_test_yjflz7HYTrlIMx",
    key_secret: "X3RTzStthGmPme2o8NlqHhgb",
  });

  static async createOrder(amount, userId) {
    try {
      // Get cart items first
      const cart = await Cart.findOne({ userId, status: 'pending' }).populate('items.productId');
      
      if (!cart || cart.items.length === 0) {
        throw new ApiError(404, 'Cart not found or empty');
      }

      // Create Razorpay Order
      const razorpayOrder = await PaymentService.razorpay.orders.create({
        amount: Math.round(Number(amount) * 100),
        currency: 'INR',
        payment_capture: 1,
      });

      // Map cart items to order products
      const orderProducts = cart.items.map(item => ({
        product: item.productId._id,
        quantity: item.quantity,
        price: item.price
      }));

      // Save Order in DB with products
      const order = await Order.create({
        user: userId,
        products: orderProducts,
        totalAmount: amount,
        razorpayOrderId: razorpayOrder.id,
        status: 'pending',
        paymentStatus: 'pending'
      });

      return {
        ...razorpayOrder,
        orderId: order._id,
      };
    } catch (error) {
      console.error('Detailed error:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
        details: error.details || error.error || error,
      });

      throw new ApiError(500, `Failed to create order: ${error.message}`);
    }
  }

  static async verifyPayment(paymentId, orderId, signature) {
    try {
      console.log('Verifying payment:', { paymentId, orderId, signature });

      if (!paymentId || !orderId || !signature) {
        throw new ApiError(400, 'Missing payment verification parameters');
      }

      const text = orderId + '|' + paymentId;
      const generated_signature = crypto
        .createHmac('sha256', "X3RTzStthGmPme2o8NlqHhgb")
        .update(text)
        .digest('hex');

      console.log('Verification details:', {
        orderId,
        paymentId,
        receivedSignature: signature,
        generatedSignature: generated_signature
      });

      if (generated_signature !== signature) {
        throw new ApiError(400, 'Invalid payment signature');
      }

      // Update order status
      const updatedOrder = await Order.findOneAndUpdate(
        { razorpayOrderId: orderId },
        { 
          $set: {
            razorpayPaymentId: paymentId,
            razorpaySignature: signature,
            status: 'completed',
            paymentStatus: 'completed'
          }
        },
        { new: true }
      );

      if (!updatedOrder) {
        throw new ApiError(404, 'Order not found');
      }

      console.log('Updated order:', updatedOrder);
      return true;
    } catch (error) {
      console.error('Payment Verification Failed:', error);
      throw new ApiError(500, `Payment verification failed: ${error.message}`);
    }
  }
}

module.exports = PaymentService;
