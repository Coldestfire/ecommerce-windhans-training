const httpStatus = require("http-status");
const CatchAsync = require("../utils/CatchAsync");
const ReviewService = require("../services/Review.service")

class ReviewController {
    static createReview = CatchAsync(async (req, res) => {
        console.log("from CategoryController: ", req.user, req.body)
        const review = await ReviewService.createReview(req.user, req.body);
        return res.status(201).json(review);
    });

    static getReviews = CatchAsync(async (req, res) => {
        // Fetch reviews by productId from query params
        const reviews = await ReviewService.getReviews(req.query.productId); 
        return res.status(200).json(reviews);
    });
    

    static updateReview = CatchAsync(async (req, res) => {
        const review = await ReviewService.updateReview(req.user ,req.params.id, req.body);
        return res.status(200).json(review);
    });

    static deleteReview = CatchAsync(async (req, res) => {
        const result = await ReviewService.deleteReview(req.user, req.params.id);
        return res.status(204).json(result);
    });

}

module.exports = ReviewController;