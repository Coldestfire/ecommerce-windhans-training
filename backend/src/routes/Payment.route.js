const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/Payment.controller');
const Authentication = require("../middlewares/Authentication")

router.use(Authentication)

router.post('/create-order', PaymentController.createOrder);
router.post('/verify-payment', PaymentController.verifyPayment);

module.exports = router; 