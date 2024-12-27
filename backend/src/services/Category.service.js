const { CategoryModel } = require('../models')
const ApiError = require("../utils/ApiError");

class CategoryService {

    static async createCategory(user, body) {
        console.log("from CategoryService: ", body)
        const category = await CategoryModel.create({
            ...body,
            user,
        });
        console.log("from querying CategoryService: ", category)
        return category;
    }
    

    static async getCategories(category = "") {
        try {
            let filter = {};
    
            // Apply filter if category name is provided
            if (category) {
                filter.name = { $regex: new RegExp("^" + category + "$", "i") }; // Case-insensitive search
            }
    
            const categories = await CategoryModel.find(filter);
            const response = {
                data: categories,
            };
            return response;
    
        } catch (error) {
            throw new Error("Failed to fetch categories. Please try again.");
        }
    }
    

    static async deleteCategory(user, categoryId) {
        // Check if the user is logged in
        if (!user) {
            throw new ApiError(401, "User must be logged in to delete a category.");
        }
    
        // Find the category by ID and check if it belongs to the logged-in user
        const category = await CategoryModel.findById(categoryId);
        console.log("from querying CategoryService: ", category)
        if (!category) {
            throw new ApiError(404, "Category not found.");
        }
    
        // If the category is valid and belongs to the user, delete it
        await CategoryModel.findByIdAndDelete(categoryId);
    
        return { msg: "category deleted successfully" };
    }
    
    // static async updateById(id, body, user) {
    //     // Check if the user is logged in
    //     if (!user) {
    //         throw new ApiError(401, "User must be logged in to update a product.");
    //     }
    
    //     // Find the product by ID and check if it belongs to the logged-in user
    //     const product = await ProductModel.findById(id);
    //     if (!product) {
    //         throw new ApiError(404, 'Product not found');
    //     }
    
    //     // Ensure that the product belongs to the logged-in user
    //     if (product.user.toString() !== user._id.toString()) {
    //         throw new ApiError(403, "You are not authorized to update this product.");
    //     }
    
    //     // If an image is provided, upload it to Cloudinary
    //     if (body.image) {
    //         const { secure_url } = await cloudinary.uploader.upload(body.image, {
    //             folder: 'products',
    //             use_filename: true,
    //             unique_filename: false,
    //         });
    //         body.image = secure_url;
    //     }
    
    //     // Update the product with the provided data
    //     await ProductModel.findByIdAndUpdate(id, body);
    
    //     return {
    //         msg: 'Product updated successfully',
    //     };
    // }
    
    // static async getById(id) {
    //     // Find the product by ID
    //     const product = await ProductModel.findById(id);
    //     if (!product) {
    //         throw new ApiError(400, "Product Not Found in Record");
    //     }
    
    //     return {
    //         product,
    //     };
    // }
}

module.exports = CategoryService;
