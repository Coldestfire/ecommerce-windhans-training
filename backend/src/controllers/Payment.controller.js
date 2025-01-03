const PaymentService = require('../services/Payment.service');
const CatchAsync = require('../utils/CatchAsync');
const ApiError = require('../utils/ApiError');

class PaymentController {
  static createOrder = CatchAsync(async (req, res) => {
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      throw new ApiError(400, 'Invalid amount');
    }

    const order = await PaymentService.createOrder(amount, req.user);
    res.status(200).json(order);
  });

  static verifyPayment = CatchAsync(async (req, res) => {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
    await PaymentService.verifyPayment(
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature
    );
    res.status(200).json({ success: true });
  });
}

module.exports = PaymentController; 