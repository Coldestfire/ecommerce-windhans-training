import React, { useState } from "react";
import { Box, TextField, Button, FormControl, InputLabel, Select, MenuItem, InputAdornment, CircularProgress, IconButton } from "@mui/material";
import { FileUpload } from 'primereact/fileupload';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCreateProductMutation, useGetAllProductsQuery } from "../../provider/queries/Products.query";
import { useGetCategoriesQuery, useDeleteCategoryMutation } from "../../provider/queries/Category.query";

import { useSearchParams } from "react-router-dom";
import TableCard from "./components/TableRowAndEdit";
import AddCategory from "./components/AddCategory";

import { buttonStyles } from "../../themes/buttonStyles";



const ProductsPage = () => {
  const [visible, setVisible] = useState(false);
  const [SearchParams] = useSearchParams();

  const [deleteCategory] = useDeleteCategoryMutation();


//get all categories
  const { data : fetchedCategories, isLoading: isLoadingCategories } = useGetCategoriesQuery({category:""});
  console.log("Fetched Categories:", fetchedCategories);

//get all products
  const { data, isLoading, isError } = useGetAllProductsQuery({
    query: SearchParams.get("query") || "",
    page: Number(SearchParams.get("page")) || 1,
    category: SearchParams.get("category") || ""
  });

  // if (isLoading) return <Loader />;
  if (isError) return <h1>Something went wrong</h1>;

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();


  const [errors, setErrors] = useState<any>({});

  
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 1,
    category: "", // Store ID
    categoryName: "", // Store name (for display only)
    image: ""
  });

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
  
    console.log("Selected Category:", selectedCategory);
  
    setNewProduct((prev) => ({
      ...prev,
      category: selectedCategoryId,        // Send ID to backend
      categoryName: selectedCategory?.name // Display name in the UI
    }));
  };


  const handleDeleteCategory = (categoryId: string) => {
    deleteCategory(categoryId);
 };
  
  
  const fetchedcategory = fetchedCategories?.data || [];
  fetchedcategory.map((category : any)=>{
    console.log("CATSSSS: ", category._id);
  })
  console.log("CATSSSS: ", fetchedcategory);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };



  const validateForm = () => {
    const newErrors = {};
    if (!newProduct.name) newErrors.name = "Product name is required";
    if (!newProduct.description) newErrors.description = "Description is required";
    if (!newProduct.price || newProduct.price <= 0) newErrors.price = "Price must be greater than 0";
    if (!newProduct.stock || newProduct.stock <= 0) newErrors.stock = "Stock must be greater than 0";
    if (!newProduct.category) newErrors.category = "Category is required"; // Already works with an empty string
    if (!newProduct.image) newErrors.image = "Image is required";
    setErrors(newErrors);
  
    return Object.keys(newErrors).length === 0;  // Return true if there are no errors
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await createProduct(newProduct);
      setNewProduct({
        name: "",
        description: "",
        price: 0,
        stock: 1,
        category: null,
        image: ""
      });
      setVisible(false);
    } catch (error) {
      console.error("Error creating a product:", error);
    }
  };

  console.log("Selected Category ID:", newProduct.category);
  console.log("Selected Category Name:", newProduct.categoryName);



  return (
    <>
      <div  className="flex justify-end items-center w-[90%] mx-auto mb-4 gap-4">

                <Button
                onClick={() => setVisible(true)}
                variant="contained"
                color="primary"
                disableElevation
                sx={{
                 ...buttonStyles,
                }}
              >
                Add Product
              </Button>


            <AddCategory />
          </div>

      
      {visible && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow w-[90%] max-w-lg relative pr-9">
            <h2 className="text-lg font-semibold mb-4 pl-3">Add New Product</h2>
            <Box
              component="form"
              onSubmit={handleAddProduct}
              sx={{
                '& .MuiTextField-root': { m: 1, width: '100%' },
                '& .MuiFormControl-root': { m: 1, width: '100%' },
              }}
              noValidate
              autoComplete="off"
            >
              <TextField
                name="name"
                label="Name"
                value={newProduct.name}
                onChange={handleInputChange}
                fullWidth
                required
                error={Boolean(errors.name)}
                helperText={errors.name}
              />

              <TextField
                name="description"
                label="Description"
                value={newProduct.description}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={4}
                required
                error={Boolean(errors.description)}
                helperText={errors.description}
              />

              {/* Price field using Material UI's TextField with InputAdornment */}
              <TextField
                name="price"
                label="Price"
                value={newProduct.price}
                onChange={handleInputChange}
                fullWidth
                required
                type="number"
                error={Boolean(errors.price)}
                helperText={errors.price}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }}
              />

              {/* Stock field using Material UI's TextField */}
              <TextField
                name="stock"
                label="Stock"
                value={newProduct.stock}
                onChange={handleInputChange}
                fullWidth
                required
                type="number"
                error={Boolean(errors.stock)}
                helperText={errors.stock}
              />

              <FormControl fullWidth required error={Boolean(errors.category)} sx={{ margin: 1 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={newProduct.category}
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
                  // Fix: Display only the category name in the input box
                  renderValue={(selected) => {
                    const selectedCategory = fetchedCategories?.data?.find((cat) => String(cat._id) === selected);
                    return selectedCategory ? selectedCategory.name : "";
                  }}
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




              <AddCategory />


              <FileUpload
                name="image"
                onSelect={handleImageChange}
                accept="image/*"
                className="w-full"
                mode="basic"
                style={{paddingLeft: 8, paddingTop: 3}}
              />
              {errors.image && <span className="MuiFormHelperText-root text-xs text-red-500 ml-7 mt-1">{errors.image}</span>}

              <div className="flex justify-end gap-4 mt-4">
                <Button
                  type="button"
                  variant="outlined"
                  color="secondary"
                  onClick={() => setVisible(false)}
                  sx={{ padding: "10px 20px" }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isCreating}
                  sx={{ padding: "10px 20px" }}
                  startIcon={isCreating ? <CircularProgress size={24} /> : null}
                >
                  {isCreating ? "Adding..." : "Add Product"}
                </Button>
              </div>
            </Box>
          </div>
        </div>
      )}

      <div className="relative overflow-x-auto shadow">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">ID</th>
              <th scope="col" className="px-6 py-3">Name</th>
              <th scope="col" className="px-6 py-3">Price</th>
              <th scope="col" className="px-6 py-3">Stock</th>
              <th scope="col" className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.data && data.data.length > 0 && data.data.map((product: any, i: number) => (
              <TableCard key={i} id={i + 1} data={product} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ProductsPage;
