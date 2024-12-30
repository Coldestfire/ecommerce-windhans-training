const express = require('express');
const router = express.Router();
const ReviewController = require('../controllers/Review.controller');
const Authentication = require("../middlewares/Authentication");

// router.get('/', CategoryController.getCategory);

router.use(Authentication);


router.post('/', ReviewController.createReview); 
// router.patch('/:id', CategoryController.updateCategory); 
// router.delete('/:id', CategoryController.deleteCategory); 


module.exports = router;