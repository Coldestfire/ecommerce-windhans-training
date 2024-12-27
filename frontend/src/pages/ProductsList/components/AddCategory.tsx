import { Button, TextField } from "@mui/material";
import { useCreateCategoryMutation } from "../../../provider/queries/Category.query";
import { useState } from "react";

const AddCategory = () => {
  // Mutation hook for creating a new category
  const [createCategory, { isLoading: isCreatingCategory }] = useCreateCategoryMutation();

  // States for modal visibility, category input, and error handling
  const [visible, setVisible] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "" });
  const [error, setError] = useState(""); // For validation or API errors

  // Opens the modal
  const handleAddCategoryButton = () => {
    setVisible(true);
    setError(""); // Clear any previous errors
  };

  // Handles input changes for category name
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewCategory((prev) => ({ ...prev, [name]: value }));
  };

  // Handles form submission
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation: Ensure category name is not empty
    if (!newCategory.name.trim()) {
      setError("Category name is required."); // Set error message
      return;
    }

    try {
      // Call API to create a new category
      await createCategory(newCategory).unwrap(); // Ensure the promise resolves properly
      setVisible(false); // Close modal only on success
      setNewCategory({ name: "" }); // Clear input field
      setError(""); // Reset error state
    } catch (err) {
      console.error("Failed to create category:", err);
      setError("Failed to create category. Please try again."); // Show error message
    }
  };

  return (
    <>
      {/* Modal */}
      {visible && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow w-[90%] max-w-lg relative pr-9">

            {/* Modal Header */}
            <h2 className="text-lg font-semibold mb-4 pl-3">Add New Category</h2>

            {/* Removed <form> tag from here */}
            <TextField
              name="name"
              label="Category Name"
              variant="outlined"
              fullWidth
              value={newCategory.name}
              sx={{ marginBottom: "16px" }}
              onChange={handleInputChange}
              error={Boolean(error)} // Shows error styling if there's an error
              helperText={error} // Displays error text below the input field
            />

            {/* Modal Buttons */}
            <div className="flex justify-end gap-4 mt-4">
              {/* Cancel Button */}
              <Button
                type="button"
                variant="outlined"
                color="secondary"
                onClick={() => setVisible(false)} // Close modal
                sx={{ padding: "10px 20px" }}
              >
                Cancel
              </Button>

              {/* Submit Button */}
              <Button
                type="button" // Changed to type="button" to prevent form submission
                variant="contained"
                color="primary"
                disabled={isCreatingCategory} // Disable during submission
                sx={{ padding: "10px 20px" }}
                onClick={handleFormSubmit} // Trigger the submit logic directly
              >
                Submit
              </Button>
            </div>
            {/* End of modal buttons */}
          </div>
        </div>
      )}

      {/* Add Category Button */}
      {!visible && (
        <Button
          variant="contained"
          disableElevation
          color="primary"
          sx={{ flex: 1, marginLeft: 1, padding: 1, marginBottom: 2 }}
          onClick={handleAddCategoryButton}
        >
          Add Category
        </Button>
      )}
    </>
  );
};

export default AddCategory;
