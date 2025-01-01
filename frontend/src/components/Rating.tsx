import Rating from '@mui/material/Rating';
import { useGetReviewQuery } from '../provider/queries/Reviews.query';
import { Box, Skeleton, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

interface ProductRatingProps {
  id: string;
  showCount?: boolean;
}

const ProductRating: React.FC<ProductRatingProps> = ({ id, showCount = false }) => {
  const { data: reviews, error: reviewsError, isLoading: reviewsLoading } = useGetReviewQuery(id);

  // Handle loading state with skeleton
  if (reviewsLoading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Skeleton variant="rounded" width={120} height={24} />
        {showCount && <Skeleton variant="text" width={60} />}
      </Box>
    );
  }

  // Handle error or no reviews state
  if (reviewsError || !reviews?.data?.length) {
    return (
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        color: 'text.secondary'
      }}>
        <Rating
          name="no-rating"
          value={0}
          readOnly
          emptyIcon={<StarIcon style={{ opacity: 0.3 }} fontSize="inherit" />}
          sx={{ 
            fontSize: '1.2rem',
            opacity: 0.7
          }}
        />
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          (0 reviews)
        </Typography>
      </Box>
    );
  }

  // Calculate average rating
  const avgRating = reviews.data.reduce((acc: number, curr: { rating: number }) => acc + curr.rating, 0) / reviews.data.length;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Rating
        name="product-rating"
        value={avgRating}
        precision={0.5}
        readOnly
        sx={{ 
          fontSize: '1.2rem',
          '& .MuiRating-iconFilled': {
            color: '#faaf00',
          },
          '& .MuiRating-iconHover': {
            color: '#faaf00',
          }
        }}
      />
      <Typography 
        variant="body2" 
        sx={{ 
          color: 'text.secondary',
          fontSize: '0.875rem'
        }}
      >
        ({reviews.data.length} {reviews.data.length === 1 ? 'review' : 'reviews'})
      </Typography>
    </Box>
  );
};

export default ProductRating;