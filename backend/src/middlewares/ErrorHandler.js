const ApiError = require("../utils/ApiError");

const ErrorHandling = (err, req, res, next) => {

   
    const statusCode = err instanceof ApiError ? err.statusCode : 500;
    const message = err.message || "Something went wrong";

    
    if (typeof err !== "object") {
        err = { message: String(err), stack: "" };
    }

    const obj = {
        statusCode,
        message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    };

    
    if (typeof obj.statusCode !== "number" || obj.statusCode < 100 || obj.statusCode > 599) {
        obj.statusCode = 500; 
    }

    res.status(obj.statusCode).json(obj);
};

module.exports = ErrorHandling;