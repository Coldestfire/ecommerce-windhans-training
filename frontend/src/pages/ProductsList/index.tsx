import React, { useState } from "react";
import { 
  Box, 
  TextField, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  InputAdornment, 
  CircularProgress, 
  IconButton,
  Typography,
  Container,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  Divider
} from "@mui/material";
import { FileUpload } from 'primereact/fileupload';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { useCreateProductMutation, useGetAllProductsQuery } from "../../provider/queries/Products.query";
import { useGetCategoriesQuery, useDeleteCategoryMutation } from "../../provider/queries/Category.query";
import { useSearchParams } from "react-router-dom";
import TableCard from "./components/TableRowAndEdit";
import AddCategory from "./components/AddCategory";

const ProductsPage = () => {
  const [visible, setVisible] = useState(false);
  const [SearchParams] = useSearchParams();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [errors, setErrors] = useState<any>({});
  
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 1,
    category: "",
    categoryName: "",
    images: [],
  });

  // Queries
  const { data : fetchedCategories, isLoading: isLoadingCategories } = useGetCategoriesQuery({category:""});
  const { data, isLoading, isError } = useGetAllProductsQuery({
    query: SearchParams.get("query") || "",
    page: Number(SearchParams.get("page")) || 1,
    category: SearchParams.get("category") || ""
  });
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();

  const [editingId, setEditingId] = useState<string | null>(null);

  const handleEditStart = (productId: string) => {
    setEditingId(productId);
  };

  const handleEditEnd = () => {
    setEditingId(null);
  };

  // Handlers
  const handleCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    const selectedCategory = fetchedCategories?.data?.find(
      (cat) => cat._id === selectedCategoryId
    );
    
    setNewProduct((prev) => ({
      ...prev,
      category: selectedCategoryId,
      categoryName: selectedCategory?.name
    }));
  };

  const handleDeleteCategory = (categoryId: string) => {
    deleteCategory(categoryId);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = e.files;
    const imageArray = [];
  
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onloadend = () => {
        imageArray.push(reader.result);
        if (imageArray.length === files.length) {
          setNewProduct((prev) => ({ ...prev, images: imageArray }));
        }
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
    if (!newProduct.category) newErrors.category = "Category is required";
    if (!newProduct.images || newProduct.images.length === 0) {
      newErrors.image = "At least one image is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await createProduct({
        ...newProduct,
        images: newProduct.images,
      });
      
      setNewProduct({
        name: "",
        description: "",
        price: 0,
        stock: 1,
        category: "",
        images: [],
      });
      setVisible(false);
    } catch (error) {
      console.error("Error creating a product:", error);
    }
  };

  if (isError) return <Typography color="error">Something went wrong</Typography>;

  

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main' }}>
          Products Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setVisible(true)}
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              textTransform: 'none',
              px: 3,
              py: 1,
              '&:hover': {
                bgcolor: 'primary.dark',
              }
            }}
          >
            Add Product
          </Button>
          <AddCategory />
        </Box>
      </Box>

      {/* Products Table */}
      <Paper sx={{ 
        borderRadius: 2, 
        overflow: 'hidden', 
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        bgcolor: 'background.paper' 
      }}>
        <Box sx={{ p: 3 }}>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
      {data?.data?.map((product: any, i: number) => (
        <TableCard 
          key={i} 
          id={i + 1} 
          data={product}
          isEditing={editingId === product._id}
          onEditStart={() => handleEditStart(product._id)}
          onEditEnd={handleEditEnd}
        />
      ))}
    </tbody>
          </table>
        </Box>
      </Paper>

      {/* Add Product Dialog */}
      <Dialog 
        open={visible} 
        onClose={() => setVisible(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ 
          pb: 2, 
          pt: 3,
          px: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
            Add New Product
          </Typography>
          <IconButton
            onClick={() => setVisible(false)}
            size="small"
            sx={{
              color: 'text.secondary',
              '&:hover': { color: 'error.main' }
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <Divider />
        
        <DialogContent sx={{ p: 3 }}>
          <Box
            component="form"
            onSubmit={handleAddProduct}
            sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
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

            <FormControl fullWidth required error={Boolean(errors.category)}>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={newProduct.category}
                onChange={handleCategoryChange}
                label="Category"
              >
                {fetchedCategories?.data?.map((cat) => (
                  <MenuItem
                    key={cat._id}
                    value={cat._id}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span>{cat.name}</span>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
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
                <Typography variant="caption" color="error" sx={{ ml: 2, mt: 0.5 }}>
                  {errors.category}
                </Typography>
              )}
            </FormControl>

            <Box sx={{ mb: 2 }}>
              <FileUpload
                name="image"
                onSelect={handleImageChange}
                accept="image/*"
                multiple
                emptyTemplate={
                  <Box sx={{ 
                    p: 3, 
                    textAlign: 'center',
                    color: 'text.secondary',
                    bgcolor: 'grey.50',
                    borderRadius: 1
                  }}>
                    <Typography>Drag and drop images here or click to upload</Typography>
                  </Box>
                }
              />
              {errors.image && (
                <Typography variant="caption" color="error" sx={{ ml: 2, mt: 0.5 }}>
                  {errors.image}
                </Typography>
              )}
            </Box>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
              <Button
                type="button"
                variant="outlined"
                onClick={() => setVisible(false)}
                sx={{ 
                  px: 3,
                  py: 1,
                  textTransform: 'none'
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isCreating}
                sx={{ 
                  px: 3,
                  py: 1,
                  textTransform: 'none'
                }}
                startIcon={isCreating ? <CircularProgress size={20} /> : null}
              >
                {isCreating ? "Adding..." : "Add Product"}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default ProductsPage;