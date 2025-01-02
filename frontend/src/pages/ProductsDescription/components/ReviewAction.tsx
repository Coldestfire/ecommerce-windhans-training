import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Rating, 
  TextField, 
  Button, 
  Paper,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useCreateReviewMutation, useUpdateReviewMutation, useGetReviewQuery, useDeleteReviewMutation } from '../../../provider/queries/Reviews.query';
import { toast } from 'sonner';
import RateReviewIcon from '@mui/icons-material/RateReview';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector } from 'react-redux';
import { UserSlicePath } from '../../../provider/slice/user.slice';
import { useProtectedAction } from '../../../hooks/useProtectedAction';
import { useAuth } from '../../../hooks/useAuth';

interface ReviewActionProps {
  productId: string;
  onReviewAction: () => void;
}

const ReviewAction = ({ productId, onReviewAction }: ReviewActionProps) => {
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [addReview, { isLoading: isAddLoading }] = useCreateReviewMutation();
  const [updateReview, { isLoading: isUpdateLoading }] = useUpdateReviewMutation();
  const [deleteReview, { isLoading: isDeleteLoading }] = useDeleteReviewMutation();
  const { data: reviews } = useGetReviewQuery(productId, {
    skip: !useAuth().isAuthenticated
  });
  const currentUser = useSelector(UserSlicePath);
  const runProtectedAction = useProtectedAction();

  const userReview = reviews?.data?.find(review => review.user._id === currentUser?._id);
  const isEditing = !!userReview;

  useEffect(() => {
    if (userReview) {
      setRating(userReview.rating);
      setReview(userReview.review);
    }
  }, [userReview]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    runProtectedAction(async () => {
      if (!rating) {
        toast.error('Please select a rating');
        return;
      }
      if (!review.trim()) {
        toast.error('Please write a review');
        return;
      }

      try {
        if (isEditing) {
          await updateReview({
            id: userReview._id,
            data: { rating, review }
          }).unwrap();
          toast.success('Review updated successfully');
        } else {
          await addReview({
            productId,
            rating,
            review
          }).unwrap();
          toast.success('Review added successfully');
        }
        
        setIsExpanded(false);
        onReviewAction();
      } catch (error) {
        toast.error(`Failed to ${isEditing ? 'update' : 'add'} review`);
      }
    });
  };

  const handleDelete = async () => {
    runProtectedAction(async () => {
      try {
        await deleteReview(userReview._id).unwrap();
        toast.success('Review deleted successfully');
        setIsDeleteDialogOpen(false);
        setRating(0);
        setReview('');
        onReviewAction();
      } catch (error) {
        toast.error('Failed to delete review');
      }
    });
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
        <Box 
          sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}
         
        >
        
          {isEditing ? <EditIcon color="primary" /> : <RateReviewIcon color="primary" />}
          <Typography variant="h6" sx={{ fontWeight: 500 }}>
            {isEditing ? 'Edit Your Review' : 'Write a Review'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
         
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ fontWeight: 500, cursor: 'pointer' }}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Click to collapse' : 'Click to expand'}
          </Typography>
        </Box>
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
             {isEditing && (
            <Button
              onClick={() => setIsDeleteDialogOpen(true)}
              size="small"
              color="error"
              variant="outlined"
              startIcon={<DeleteIcon />}
              sx={{ 
                mr: 1,
                bgcolor: 'error.lighter',
                borderColor: 'error.light',
                '&:hover': {
                  bgcolor: 'error.100',
                  borderColor: 'error.main'
                },
                textTransform: 'none',
                fontWeight: 500,
                padding: '10px 10px'
              }}
            >
              Delete Review
            </Button>
          )}
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
              onChange={(_, newValue) => setRating(newValue || 0)}
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
            disabled={isAddLoading || isUpdateLoading}
            sx={{
              py: 1,
              px: 4,
              alignSelf: 'flex-start',
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            {isAddLoading || isUpdateLoading ? 
              `${isEditing ? 'Updating' : 'Submitting'}...` : 
              isEditing ? 'Update Review' : 'Submit Review'
            }
          </Button>
        </Box>
      </Collapse>

      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete Review</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete your review? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button 
            onClick={() => setIsDeleteDialogOpen(false)}
            sx={{ textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={isDeleteLoading}
            sx={{ textTransform: 'none' }}
          >
            {isDeleteLoading ? 'Deleting...' : 'Delete Review'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ReviewAction;