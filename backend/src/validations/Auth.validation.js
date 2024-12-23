const {body} = require("express-validator")
class AuthValidation {


    static RegisterUser = [
            body("name").notEmpty().withMessage("name can not be empty"),
            body("email").isEmail().withMessage("email must be valid").notEmpty().withMessage("name can not be empty"),
            body("password").isLength({min:6}).withMessage("password should include minimum 6 characters").notEmpty().withMessage("password is required")
    ]
 static LoginUser = [ 
            body("email").isEmail().withMessage("email must be valid").notEmpty().withMessage("name can not be empty"),
            body("password").isLength({min:6}).withMessage("password should include minimum 6 characters").notEmpty().withMessage("password is required")
    ]

    
}

module.exports =AuthValidation