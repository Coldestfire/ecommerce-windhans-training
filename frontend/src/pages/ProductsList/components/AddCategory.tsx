import { Button, TextField, Box, CircularProgress } from "@mui/material";
import { useCreateCategoryMutation } from "../../../provider/queries/Category.query";
import { useState } from "react";

const AddCategory = () => {
  // Mutation hook for creating a new category
  const [createCategory, { isLoading: isCreatingCategory }] = useCreateCategoryMutation();

  // States for modal visibility, category input, and error handling
  const [visible, setVisible] = useState(false);
  const [newCategory, setNewCategory] = useState(""); // Simplified state for category name
  const [error, setError] = useState(""); // For validation or API errors

  // Opens the modal
  const handleOpenModal = () => {
    setVisible(true);
    setError(""); // Clear any previous errors
  };

  // Closes the modal and resets state
  const handleCloseModal = () => {
    setVisible(false);
    setNewCategory("");
    setError("");
  };

  // Handles form submission
  const handleFormSubmit = async () => {
    // Validation: Ensure category name is not empty
    if (!newCategory.trim()) {
      setError("Category name is required.");
      return;
    }

    try {
      // Call API to create a new category
      await createCategory({ name: newCategory }).unwrap();
      handleCloseModal(); // Close modal only on success
    } catch (err) {
      console.error("Failed to create category:", err);
      setError("Failed to create category. Please try again."); // Show error message
    }
  };

  // Handles Enter key press for form submission
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevents default form submission behavior
      handleFormSubmit(); // Submits the form
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
            {/* Modal Header */}
            <h2 className="text-lg font-semibold mb-4">Add New Category</h2>

            {/* Input Field */}
            <TextField
              label="Category Name"
              variant="outlined"
              fullWidth
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              error={Boolean(error)} // Error style if validation fails
              helperText={error} // Displays error text below the input field
              autoFocus
            />

            {/* Modal Buttons */}
            <div className="flex justify-end gap-4 mt-6">
              {/* Cancel Button */}
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleCloseModal}
                sx={{ padding: "8px 20px" }}
              >
                Cancel
              </Button>

              {/* Submit Button */}
              <Button
                variant="contained"
                color="primary"
                sx={{ padding: "8px 20px" }}
                disabled={isCreatingCategory} // Disable during submission
                onClick={handleFormSubmit}
              >
                {isCreatingCategory ? <CircularProgress size={24} /> : "Submit"}
              </Button>
            </div>
          </Box>
        </div>
      )}

      {/* Add Category Button */}
      {!visible && (
        <Button
          variant="contained"
          disableElevation
          color="primary"
          sx={{ flex: 1, marginLeft: 1, padding: 1, marginBottom: 2 }}
          onClick={handleOpenModal}
        >
          Add New Category
        </Button>
      )}
    </>
  );
};

export default AddCategory;
