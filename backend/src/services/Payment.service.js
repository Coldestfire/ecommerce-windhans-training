const Razorpay = require('razorpay');
const crypto = require('crypto');
const ApiError = require('../utils/ApiError');
const Order = require('../models/order.models');
require('dotenv').config();

class PaymentService {
  // Initialize Razorpay
  static razorpay = new Razorpay({
    key_id: "rzp_test_yjflz7HYTrlIMx",
    key_secret: "X3RTzStthGmPme2o8NlqHhgb",
  });

  static async createOrder(amount, userId) {
    try {
      console.log(amount, userId);

      // Log Razorpay config
      console.log('Creating Razorpay order with:', {
        amount,
        keyId: process.env.RAZORPAY_KEY_ID,
        hasSecret: !!process.env.RAZORPAY_KEY_SECRET,
      });

      // Create Razorpay Order
      const razorpayOrder = await PaymentService.razorpay.orders.create({
        amount: Math.round(Number(amount) * 100), // Convert to paise
        currency: 'INR',
        payment_capture: 1,
      });

      console.log('Razorpay Order:', razorpayOrder);

      // Save Order in DB
      const order = await Order.create({
        user: userId,
        totalAmount: amount,
        razorpayOrderId: razorpayOrder.id,
        status: 'pending',
        paymentStatus: 'pending',
        products: [],
      });

      console.log('DB Order:', order);

      // Return Order
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
      const text = orderId + '|' + paymentId;
      const generated_signature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(text)
        .digest('hex');

      if (generated_signature !== signature) {
        throw new ApiError(400, 'Invalid payment signature');
      }

      return true;
    } catch (error) {
      console.error('Payment Verification Failed:', error.message);
      throw new ApiError(500, 'Payment verification failed.');
    }
  }
}

module.exports = PaymentService;
