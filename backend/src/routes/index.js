const router = require("express").Router();


const routes= [
    {
        path:'/auth',
        route:require("./Auth.route")
    },
    {
        path:'/products',
        route:require("./Product.route")
    },
    {
        path:'/categories',
        route:require("./Category.route")
    },
    {
        path:'/reviews',
        route:require("./Review.route")
    },
    {
        path:'/cart',
        route:require("./Cart.route")
    },
    {
        path:'/wishlist',
        route:require("./Wishlist.route")
    },
    {
        path:'/payment',
        route:require("./Payment.route")
    },
    {
        path:'/orders',
        route:require("./Order.route")
    }
]

routes.forEach((cur)=>{
    router.use(cur.path,cur.route);
})

module.exports = router