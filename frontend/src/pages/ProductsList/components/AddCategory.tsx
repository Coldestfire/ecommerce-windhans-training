import { Button, TextField, Box, CircularProgress } from "@mui/material";
import { useCreateCategoryMutation } from "../../../provider/queries/Category.query";
import { useState } from "react";
import { buttonStyles } from "../../../themes/buttonStyles";

const AddCategory = () => {
  const [createCategory, { isLoading: isCreatingCategory }] = useCreateCategoryMutation();
  const [newCategory, setNewCategory] = useState(""); // Category name
  const [error, setError] = useState(""); // For validation or API errors
  const [visible, setVisible] = useState(false); // State to manage modal visibility


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
      handleCloseModal(); // Close modal on successful creation
    } catch (err) {
      setError("Failed to create category. Please try again.");
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
      {/* Modal */}
      {visible && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-center justify-center">
          <Box
            className="bg-white p-6 rounded shadow-lg w-[90%] max-w-md relative"
            component="form"
            onKeyDown={handleKeyPress} // Allows submission on Enter key press
          >
            <h2 className="text-lg font-semibold mb-4">Add New Category</h2>

            {/* Category Name Input */}
            <TextField
              label="Category Name"
              variant="outlined"
              fullWidth
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              error={Boolean(error)}
              helperText={error}
              autoFocus
            />

            {/* Modal Buttons */}
            <div className="flex justify-end gap-4 mt-6">
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleCloseModal} // Close modal
                sx={{ padding: "8px 20px" }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                sx={{ padding: "8px 20px" }}
                disabled={isCreatingCategory}
                onClick={handleFormSubmit}
              >
                {isCreatingCategory ? <CircularProgress size={24} /> : "Submit"}
              </Button>
            </div>
          </Box>
        </div>
      )}

      {/* Add Category Button */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          disableElevation
          color="primary"
         sx={{
          ...buttonStyles,
            }}
          onClick={handleOpenModal} // Open modal when clicked
        >
          Add Category
        </Button>
      </div>
    </>
  );
};

export default AddCategory;
