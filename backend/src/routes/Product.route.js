const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/Product.controller');



router.get('/', ProductController.getProducts);
router.get('/every', ProductController.getEveryProduct);



router.post('/', ProductController.createProduct); 

router.patch('/:id', ProductController.updateProduct); 

router.get('/:id', ProductController.getProductById);


router.delete('/:id', ProductController.deleteProduct); 

module.exports = router;