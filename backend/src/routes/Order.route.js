const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/Order.controller');
const Authentication = require("../middlewares/Authentication");

router.use(Authentication);

router.get('/', OrderController.getOrders);

module.exports = router; 