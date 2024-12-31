import { 
  Button, 
  TextField, 
  Box, 
  CircularProgress, 
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography
} from "@mui/material";
import { useCreateCategoryMutation } from "../../../provider/queries/Category.query";
import { useState } from "react";
import { toast } from "sonner";
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

const AddCategory = () => {
  const [createCategory, { isLoading: isCreatingCategory }] = useCreateCategoryMutation();
  const [newCategory, setNewCategory] = useState("");
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(false);

  const handleOpenModal = () => {
    setVisible(true); // Open the modal
    setError(""); // Clear previous errors
  };

  const handleCloseModal = () => {
    setVisible(false); // Close the modal
    setNewCategory(""); // Reset category input
    setError(""); // Clear error messages
  };

  const handleFormSubmit = async () => {
    if (!newCategory.trim()) {
      setError("Category name is required.");
      return;
    }

    try {
      await createCategory({ name: newCategory }).unwrap();
      toast.success("Category created successfully!", { duration: 1500 });

      handleCloseModal(); // Close modal on successful creation
    } catch (err) {
      setError("Failed to create category. Please try again.");
      toast.error("Failed to create category."); // Show error toast
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission when pressing Enter
      handleFormSubmit(); // Call form submit logic
    }
  };

  return (
    <>
      <Dialog 
        open={visible} 
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { 
            borderRadius: 2,
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{ 
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          bgcolor: 'grey.50'
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Add New Category
          </Typography>
          <IconButton onClick={handleCloseModal} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          <Box
            component="form"
            onKeyDown={handleKeyPress}
            sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
          >
            <TextField
              label="Category Name"
              variant="outlined"
              fullWidth
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              error={Boolean(error)}
              helperText={error}
              autoFocus
              sx={{ mt: 1 }}
            />

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={handleCloseModal}
                sx={{ 
                  px: 3,
                  py: 1,
                  textTransform: 'none',
                  fontWeight: 500
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleFormSubmit}
                disabled={isCreatingCategory}
                sx={{ 
                  px: 3,
                  py: 1,
                  textTransform: 'none',
                  fontWeight: 500
                }}
              >
                {isCreatingCategory ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Add Category'
                )}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleOpenModal}
        sx={{
          textTransform: 'none',
          fontWeight: 500,
          px: 2,
          py: 1,
          bgcolor: 'primary.main',
          '&:hover': {
            bgcolor: 'primary.dark',
          }
        }}
      >
        Add Category
      </Button>
    </>
  );
};

export default AddCategory;