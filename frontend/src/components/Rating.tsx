import Rating from '@mui/material/Rating';
import { useGetReviewQuery } from '../provider/queries/Reviews.query';

interface ProductRatingProps {
  id: string; // Define props explicitly
}

const ProductRating: React.FC<ProductRatingProps> = ({ id }) => {
  console.log("from ProductRating: ", id);

  // Fetch reviews
  const { data: reviews, error: reviewsError, isLoading: reviewsLoading } = useGetReviewQuery(id);

  console.log("from ProductRating array of reviews: ", reviews);

  // Handle loading state
  if (reviewsLoading) {
    return <div className="text-center p-4">Loading reviews...</div>;
  }

  // Handle error state
  if (reviewsError || !reviews || !reviews.data || reviews.data.length === 0) {
    return <div className="text-center p-4 text-red-500">No reviews available</div>;
  }

  // Calculate average rating safely
  const avgRating =
    reviews.data.reduce((acc: number, curr: { rating: number }) => acc + curr.rating, 0) /
    reviews.data.length;

  console.log("from ProductRating avgRating: ", avgRating);

  return (
    <Rating
      name="simple-controlled"
      value={avgRating || 0} // Default to 0 if no rating
      readOnly
      sx={{ fontSize: '1.2rem' }}
    />
  );
};

export default ProductRating;
