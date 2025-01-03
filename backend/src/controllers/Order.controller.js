const Order = require('../models/order.models');
const CatchAsync = require('../utils/CatchAsync');
const ApiError = require('../utils/ApiError');

class OrderController {
  static getOrders = CatchAsync(async (req, res) => {
    const orders = await Order.find({ user: req.user })
      .populate({
        path: 'products.product',
        select: '_id name images price'
      })
      .sort({ createdAt: -1 });

    if (!orders) {
      throw new ApiError(404, 'No orders found');
    }

    res.status(200).json(orders);
  });
}

module.exports = OrderController; 