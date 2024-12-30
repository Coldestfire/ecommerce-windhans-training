import { useState } from "react";
import { Link } from "react-router-dom";
import { useDeleteProductMutation, useUpdateProductMutation } from "../../../provider/queries/Products.query";
import { useDeleteCategoryMutation, useGetCategoriesQuery, useUpdateCategoryMutation } from "../../../provider/queries/Category.query";
import { FileUpload } from 'primereact/fileupload';
import { FormControl, IconButton, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

const TableCard = ({ data, id }: any) => {
    const [isEditing, setIsEditing] = useState(false);
    const { data : fetchedCategories, isLoading: isLoadingCategories } = useGetCategoriesQuery({category:""})
    const [editForm, setEditForm] = useState({
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock,
        image: data.image ,
        category: data.category,
        categoryName: fetchedCategories?.data?.find((cat) => cat._id === data.category)?.name
    });

;
    const [errors, setErrors] = useState<any>({});
    const [deleteProduct] = useDeleteProductMutation();
    const [deleteCategory] = useDeleteCategoryMutation();
    const [updateProduct, { isLoading: isUpdating, error: updateError }] = useUpdateProductMutation();
    const [updateCategory, {isLoading: isUpdatingCategory, error: updateErrorCategory}] = useUpdateCategoryMutation();


    const handleDelete = (id: string) => {
        deleteProduct(id);
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditForm((prev) => ({ ...prev, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        console.log("Edit form data:", editForm);
        console.log("Edit form data category :", editForm.category);
        console.log("E: ", e);
        // if (!validateForm()) return;
        await updateCategory({ id: data.category, data: fetchedCategories?.data?.find((cat) => cat._id === data.category)?.name });
        await updateProduct({ id: data._id, data: editForm });
        setIsEditing(false);
    };

    const handleDeleteCategory = async (categoryId: string) => {
        await deleteCategory(categoryId);
    };


    const handleCategoryChange = (e) => {
        const selectedCategoryId = e.target.value; 
        console.log("Selected Category ID:", selectedCategoryId);
      
        // Ensure categories are loaded
        if (!fetchedCategories?.data) {
          console.log("Categories data is not loaded yet");
          return;
        }
      
        const selectedCategory = fetchedCategories.data.find(
          (cat) => cat._id === selectedCategoryId
        );
      
        console.log("Selected Category:from edit form", selectedCategory.name);
      
        setEditForm((prev) => ({
          ...prev,
          category: selectedCategoryId,        // Send ID to backend
          categoryName: selectedCategory?.name // Display name in the UI
        }));

        
      };

  const validateForm = () => {
    const newErrors = {};
    if (!editForm.name) newErrors.name = "Product name is required";
    if (!editForm.description) newErrors.description = "Description is required";
    if (!editForm.price || editForm.price <= 0) newErrors.price = "Price must be greater than 0";
    if (!editForm.stock || editForm.stock <= 0) newErrors.stock = "Stock must be greater than 0";
    if (!editForm.category) newErrors.category = "Category is required";
    if (!editForm.image) newErrors.image = "Image is required";
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;  // Return true if there are no errors
  };

console.log("lmao ", editForm)
    return (
        <>
            {isEditing ? (
                  <tr className="bg-white border-b">
                  <td colSpan={5} className="px-6 py-4">
                      <form onSubmit={handleFormSubmit}>
                          <div className="grid grid-cols-2 gap-4">
                              <TextField
                                  type="text"
                                  name="name"
                                  value={editForm.name}
                                  onChange={handleFormChange}
                                  placeholder="Name"
                                  className="border rounded px-4 py-2"
                                  required
                                  fullWidth
                                  label="Name"
                              />
                              <TextField
                                  type="number"
                                  name="price"
                                  value={editForm.price}
                                  onChange={handleFormChange}
                                  placeholder="Price"
                                  className="border rounded px-4 py-2"
                                  required
                                  fullWidth
                                  label="Price"
                              />

                            <FormControl fullWidth required error={Boolean(errors.category)} sx={{ margin: 1 }}>
                            <InputLabel>Category</InputLabel>
                            <Select
                                name="category"
                                value={editForm.category} // FIX 1: Bind to editForm.category
                                onChange={handleCategoryChange}
                                label="Category"
                                MenuProps={{
                                PaperProps: {
                                    style: {
                                    maxHeight: 250,
                                    overflowY: 'auto',
                                    },
                                },
                                }}
                                renderValue={() => editForm.categoryName || ""} // FIX 2: Use categoryName directly
                            >
                                {fetchedCategories?.data?.map((cat) => (
                                <MenuItem
                                    key={cat._id}
                                    value={String(cat._id)}
                                    sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    }}
                                >
                                    <span>{cat.name}</span> {/* Display category name */}

                                    {/* Delete Icon Button */}
                                    <IconButton
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent Select's onChange from firing
                                        handleDeleteCategory(cat._id);
                                    }}
                                    size="small"
                                    >
                                    <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </MenuItem>
                                ))}
                            </Select>

                            {errors.category && (
                                <span className="MuiFormHelperText-root text-xs text-red-500 ml-4 mt-1">
                                {errors.category}
                                </span>
                            )}
                            </FormControl>


                              <TextField
                                  type="number"
                                  name="stock"
                                  value={editForm.stock}
                                  onChange={handleFormChange}
                                  placeholder="Stock"
                                  className="border rounded px-4 py-2"
                                  required
                                  fullWidth
                                  label="Stock"
                              />
                              
                              {/* Description field with increased height */}
                              <TextField
                                  name="description"
                                  value={editForm.description}
                                  onChange={handleFormChange}
                                  placeholder="Description"
                                  className="border rounded px-4 py-2"
                                  multiline
                                  rows={5} // Adjust the number of rows for desired height
                                  fullWidth
                                  required
                                  label="Description"
                              />
                              
                            
                              <FileUpload
                                  name="image"
                                  accept="image/*"
                                  onSelect={handleImageChange}
                                  className="w-full"
                                  mode="basic"
                              />
                          </div>
                          
                          <div className="mt-4 flex gap-2">
                              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded" disabled={isUpdating}>
                                  {isUpdating ? "Updating..." : "Save"}
                              </button>
                              <button
                                  type="button" 
                                  onClick={() => setIsEditing(false)}
                                  className="bg-gray-500 text-white px-4 py-2 rounded"
                              >
                                  Cancel
                              </button>
                          </div>
                      </form>
                  </td>
              </tr>
            ) : (
                <tr className="bg-white border-b">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        {id}
                    </th>
                    <td className="px-6 py-4">
                        <Link to={`/product/${data._id}`} className="text-blue-500 hover:underline">
                            {data.name}
                        </Link>
                    </td>
                    <td className="px-6 py-4">&#8377;{data.price}</td>
                    <td className="px-6 py-4">{data.stock}</td>
                    <td className="px-6 py-4">
                        <button onClick={handleEditClick} className="text-blue-500 hover:underline mr-4">
                            Edit
                        </button>
                        <button onClick={() => handleDelete(data._id)} className="text-red-500 hover:underline">
                            Delete
                        </button>
                    </td>
                </tr>
            )}
        </>
    );
};

export default TableCard;
