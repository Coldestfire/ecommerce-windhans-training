const httpStatus = require("http-status");
const CatchAsync = require("../utils/CatchAsync");
const ProductService = require("../services/Product.service");

class ProductController {
    static createProduct = CatchAsync(async (req, res) => {
        console.log("from Product controller: ", req.user)
        console.log("from Product controller: ", req.body)
        const product = await ProductService.createProduct(req.user, req.body);
        return res.status(201).json(product);
    });

    static  getProducts = CatchAsync(async (req, res) => {
        const products = await ProductService.getProducts(req.user, req.query.page, req.query.query, req.query.category);
        return res.status(200).json(products);
    });

    static  getEveryProduct = CatchAsync(async (req, res) => {
        const products = await ProductService.getEveryProduct(req.user);
        return res.status(200).json(products);
    });

    static updateProduct = CatchAsync(async (req, res) => {
        const product = await ProductService.updateById(req.params.id, req.body);
        return res.status(200).json(product);
    });

    static deleteProduct = CatchAsync(async (req, res) => {
        const result = await ProductService.deleteProduct(req.params.id);
        return res.status(204).json(result);
    });


    static getProductById = CatchAsync(async (req, res) => {
        const stats = await ProductService.getById( req.params.id);
        return res.status(200).json(stats);
    });
}

module.exports = ProductController;