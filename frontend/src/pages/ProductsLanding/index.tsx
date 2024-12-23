import { useGetEveryProductQuery } from "../../provider/queries/Products.query";
import { useNavigate } from "react-router-dom";

const ProductsLanding = () => {
    const { data } = useGetEveryProductQuery({});
    const navigate = useNavigate();

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4 ml-3">
            {data?.data?.map((product) => (
                <div 
                    key={product._id}
                    className="border border-gray-300 rounded-lg p-4 text-center min-w-[100px] shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                    onClick={() => navigate(`/product/${product._id}`)}
                >
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
                    <div className="relative group mb-2">
                        <img src={product.image} alt="product-image" className="h-64 w-64 object-cover rounded-lg mx-auto transition-transform duration-300 group-hover:scale-105" />
                    </div>
                    <p className="text-gray-600">{product.price.toFixed(2)} Rps</p>
                </div>
            ))}
        </div>
    );
};

export default ProductsLanding;
