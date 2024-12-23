class PUBLIC_DATA{

    static port = process.env.PORT || 4000 
    static mongo_uri = process.env.MONGODB_URI || `mongodb://localhost/productlistner` 
    static jwt_auth = process.env.JWT_AUTH

}

module.exports = {
    PUBLIC_DATA
}