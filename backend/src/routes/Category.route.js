const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/Category.controller');
const Authentication = require("../middlewares/Authentication");

router.get('/', CategoryController.getCategory);

router.use(Authentication);


router.post('/', CategoryController.createCategory); 
router.patch('/:id', CategoryController.updateCategory); 
router.delete('/:id', CategoryController.deleteCategory); 


module.exports = router;