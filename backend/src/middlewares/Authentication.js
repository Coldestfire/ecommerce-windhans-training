const ApiError = require("../utils/ApiError")
const { validateToken } = require("../utils/Token.utils")

const Authentication = (req, res, next) => {
    try {
        const headers = req.headers['authorization'] || '';

        if (!headers || !headers.startsWith("Bearer ")) {
            throw new ApiError(401, "Please Login first");
        }

        const auth_token = headers.split(" ")[1]?.trim();

        if (!auth_token) {
            throw new ApiError(401, "Please Provide valid token");
        }

        try {
            const data = validateToken(auth_token);
            if (!data || !data.userid) {
                throw new ApiError(401, "Invalid token structure");
            }
            req.user = data.userid;
            next();
        } catch (tokenError) {
            throw new ApiError(401, "Invalid or expired token");
        }

    } catch (error) {
        next(error);
    }
};

module.exports = Authentication