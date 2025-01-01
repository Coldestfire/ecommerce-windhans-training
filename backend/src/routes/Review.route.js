const express = require('express');
const router = express.Router();
const ReviewController = require('../controllers/Review.controller');
const Authentication = require("../middlewares/Authentication");

router.get('/', ReviewController.getReviews);

router.use(Authentication);


router.post('/', ReviewController.createReview); 
router.patch('/:id', ReviewController.updateReview); 
router.delete('/:id', ReviewController.deleteReview); 


module.exports = router;