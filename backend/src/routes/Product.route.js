const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/Product.controller');
const Authentication = require("../middlewares/Authentication");

router.get('/', ProductController.getProducts);

router.get('/every', ProductController.getEveryProduct);

router.get('/:id', ProductController.getProductById);

router.use(Authentication);

router.post('/', ProductController.createProduct); 
router.patch('/:id', ProductController.updateProduct); 

router.delete('/:id', ProductController.deleteProduct); 


module.exports = router;