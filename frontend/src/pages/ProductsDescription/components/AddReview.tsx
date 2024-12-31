import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Rating, 
  TextField, 
  Button, 
  Paper,
  Collapse 
} from '@mui/material';
import { useCreateReviewMutation } from '../../../provider/queries/Reviews.query';
import { toast } from 'sonner';
import RateReviewIcon from '@mui/icons-material/RateReview';

interface AddReviewProps {
  productId: string;
  onReviewAdded: () => void;
}

const AddReview = ({ productId, onReviewAdded }: AddReviewProps) => {
  const [rating, setRating] = useState<number | null>(0);
  const [review, setReview] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [addReview, { isLoading }] = useCreateReviewMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) {
      toast.error('Please select a rating');
      return;
    }
    if (!review.trim()) {
      toast.error('Please write a review');
      return;
    }

    try {
      await addReview({
        productId,
        rating,
        review
      }).unwrap();
      
      toast.success('Review added successfully');
      setRating(0);
      setReview('');
      setIsExpanded(false);
      onReviewAdded();
    } catch (error) {
      toast.error('Failed to add review');
    }
  };

  return (
    <Paper 
      elevation={0}
      sx={{ 
        mt: 4, 
        mb: 4,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        overflow: 'hidden'
      }}
    >
      <Box
        sx={{
          p: 2,
          cursor: 'pointer',
          bgcolor: 'background.paper',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          '&:hover': {
            bgcolor: 'action.hover'
          }
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <RateReviewIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 500 }}>
            Write a Review
          </Typography>
        </Box>
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ fontWeight: 500 }}
        >
          {isExpanded ? 'Click to collapse' : 'Click to expand'}
        </Typography>
      </Box>

      <Collapse in={isExpanded}>
        <Box 
          component="form" 
          onSubmit={handleSubmit}
          sx={{ 
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            bgcolor: 'grey.50'
          }}
        >
          <Box>
            <Typography 
              variant="subtitle1" 
              gutterBottom
              sx={{ fontWeight: 500 }}
            >
              Your Rating
            </Typography>
            <Rating
              value={rating}
              onChange={(_, newValue) => setRating(newValue)}
              size="large"
              sx={{
                '& .MuiRating-iconFilled': {
                  color: 'primary.main'
                }
              }}
            />
          </Box>

          <TextField
            multiline
            rows={4}
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Share your experience with this product..."
            variant="outlined"
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: 'background.paper'
              }
            }}
          />

          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            sx={{
              py: 1,
              px: 4,
              alignSelf: 'flex-start',
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            {isLoading ? 'Submitting...' : 'Submit Review'}
          </Button>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default AddReview;