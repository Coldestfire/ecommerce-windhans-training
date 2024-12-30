const httpStatus = require("http-status");
const CatchAsync = require("../utils/CatchAsync");
const ReviewService = require("../services/Review.service")

class ReviewController {
    static createReview = CatchAsync(async (req, res) => {
        console.log("from CategoryController: ", req.user, req.body)
        const category = await ReviewService.createReview(req.user, req.body);
        return res.status(201).json(category);
    });

    // static  getCategory = CatchAsync(async (req, res) => {
    //     const categories = await CategoryService.getCategories(req.query.category);
    //     return res.status(200).json(categories);
    // });

    // static updateCategory = CatchAsync(async (req, res) => {
    //     const product = await CategoryService.updateById(req.params.id, req.body);
    //     return res.status(200).json(product);
    // });

    // static deleteCategory = CatchAsync(async (req, res) => {
    //     const result = await CategoryService.deleteCategory(req.user, req.params.id);
    //     return res.status(204).json(result);
    // });

    // static getCategoryById = CatchAsync(async (req, res) => {
    //     const stats = await CategoryService.getById( req.params.id);
    //     return res.status(200).json(stats);
    // });
}

module.exports = ReviewController;