import { useParams } from 'react-router-dom';
import { useGetProductQuery } from '../../provider/queries/Products.query';

function ProductDetails() {
  const { id } = useParams();  // Get the product ID from the URL

  const { data: product, error, isLoading } = useGetProductQuery(id);

  // Show loading state
  if (isLoading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  // Show error message if fetching fails
  if (error) {
    return <div className="text-center p-4 text-red-500">{error.message}</div>;
  }

  // Render product details if fetched successfully
  return (
    <div className="flex space-x-8 p-8 bg-white rounded-lg shadow-lg mt-3">
      <div className="flex-shrink-0">
        <img src={product.product.image} alt="product-image" className='w-80 h-80 object-cover rounded-lg shadow-md' />
      </div>
      <div className="flex flex-col justify-center">
        <h1 className="text-2xl font-bold text-gray-800">{product.product.name}</h1>
        <p className="mt-2 text-gray-600"><strong>Description:</strong> {product.product.description}</p>
        <p className="mt-2 text-gray-600"><strong>Category:</strong> {product.product.category}</p>
        
        <p className="mt-1 text-gray-800"><strong>Price:</strong> {product.product.price.toFixed(2)} Rps</p>
      </div>
    </div>
  );
}

export default ProductDetails;
