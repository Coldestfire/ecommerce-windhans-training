const { ProductModel } = require('../models')
const ApiError = require("../utils/ApiError");
const cloudinary = require ('../config/cloudinary.config');

class ProductService {

    static async createProduct(body) {  
        const { image } = body;

        if (image) {
            const { secure_url } = await cloudinary.uploader.upload(image, {
                folder: 'products',
                use_filename: true,
                unique_filename: false,
            });
            body.image = secure_url;
        }
    
        const product = await ProductModel.create(body);
        return product;
    }
    
    
    static async getProducts(page = 1, query = "", category = "") {
        const validatedPage = Math.max(1, page); 
        const limit = 10; 
        const skip = (validatedPage - 1) * limit;
    
        // Construct the filter based on query and category
        const filter = {};
    
        // If query is provided, filter by name (optional, but can still be used if needed)
        if (query) {
            filter.name = { $regex: query, $options: "i" };
        }
    
        // If category is provided, filter by category exactly
        if (category) {
            filter.category = category;
        }
    
        try {
            // Fetch products with the constructed filter
            const products = await ProductModel.find(filter)
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 });
    
            // Count the total number of matching documents
            const totalCount = await ProductModel.countDocuments(filter);
    
            const response = {
                data: products,
                total: totalCount,
                hasMore: skip + products.length < totalCount,
            };
    
            return response;
        } catch (error) {
            console.error("Database error in getProducts:", error);
            throw new Error("Failed to fetch products. Please try again.");
        }
    }
    



    static async getEveryProduct() {
        try {
            
            const products = await ProductModel.find().sort({ createdAt: -1 });

            
            const totalCount = products.length;

          
            const response = {
                data: products,
                total: totalCount,
            };

            return response;
        } catch (error) {
            
            console.error("Database error in getEveryProduct:", error);
            throw new Error("Failed to fetch products. Please try again.");
        }
    }

    static async deleteProduct(productId) {
        const product = await ProductModel.findByIdAndDelete(productId);
        if (!product) {
            throw new ApiError(404, "Product not found or could not be deleted.");
        }
        return { msg: "Product deleted successfully" };
    }


    static async updateById(id, body) {
        const { name, price, stock, lowStockThreshold, description , image, category, stars } = body;
        
        // Check if the product exists
        const product = await ProductModel.findById(id);
        if (!product) {
            throw new ApiError(404, 'Product not found');
        }

        if (image) {
            const { secure_url } = await cloudinary.uploader.upload(image, {
                folder: 'products',
                use_filename: true,
                unique_filename: false,
            });
            body.image = secure_url;
        }
      
        await ProductModel.findByIdAndUpdate(id, { name, price, stock, lowStockThreshold, description, image, category, stars });

        return {
            msg: 'Product updated successfully',
        };
    }

    static async getById(id) {
      
        const product = await ProductModel.findById(id);

        
        if (!product) {
            throw new ApiError(400, "Product Not Found in Record");
        }

        return {
            product, 
        };
    }
}

module.exports = ProductService;
