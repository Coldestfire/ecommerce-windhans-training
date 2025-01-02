import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  TextField, 
  Button, 
  FormControl, 
  InputLabel, 
  MenuItem, 
  Select, 
  IconButton,
  Paper,
  Box,
  Typography,
  Grid,
  Collapse
} from "@mui/material";
import { FileUpload } from 'primereact/fileupload';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { useDeleteProductMutation, useUpdateProductMutation } from "../../../provider/queries/Products.query";
import { useDeleteCategoryMutation, useGetCategoriesQuery } from "../../../provider/queries/Category.query";
import { formatIndianPrice } from "../../../themes/formatPrices";

const TableCard = ({ 
  data, 
  id, 
  isEditing, 
  onEditStart, 
  onEditEnd 
}: {
  data: any;
  id: number;
  isEditing: boolean;
  onEditStart: () => void;
  onEditEnd: () => void;
}) => {
    const { data: fetchedCategories } = useGetCategoriesQuery({category:""})
   
    const [editForm, setEditForm] = useState({
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock,
        images: data.images,
        category: data.category,
        categoryName: data.category.name
    });

    const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
    const [newImages, setNewImages] = useState<string[]>([]);

    const [errors, setErrors] = useState<any>({});
    const [deleteProduct] = useDeleteProductMutation();
    const [deleteCategory] = useDeleteCategoryMutation();
    const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();


    const handleDelete = (id: string) => {
        deleteProduct(id);
    };

    const handleEditClick = () => {
        onEditStart();
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const files = e.files;
        if (files) {
            Array.from(files).forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setNewImages(prev => [...prev, reader.result as string]);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const handleDeleteImage = (imageUrl: string) => {
        setImagesToDelete(prev => [...prev, imageUrl]);
        setEditForm(prev => ({
            ...prev,
            images: prev.images.filter(img => img !== imageUrl)
        }));
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const updatedImages = [
            ...editForm.images.filter(img => !imagesToDelete.includes(img)),
            ...newImages
        ];

        await updateProduct({ 
            id: data._id, 
            data: {
                ...editForm,
                images: updatedImages
            }
        });
        onEditEnd();
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

    const handleCancelClick = () => {
        onEditEnd();
    };

    return (
        <tr className="hover:bg-gray-50 transition-colors">
            {isEditing ? (
                <td colSpan={5}>
                    <Collapse in={isEditing}>
                        <Paper elevation={0} sx={{ p: 3, bgcolor: 'grey.50' }}>
                            <form onSubmit={handleFormSubmit}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            name="name"
                                            label="Name"
                                            value={editForm.name}
                                            onChange={handleFormChange}
                                            fullWidth
                                            required
                                            variant="outlined"
                                            sx={{ bgcolor: 'white' }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <TextField
                                            name="price"
                                            label="Price"
                                            type="number"
                                            value={editForm.price}
                                            onChange={handleFormChange}
                                            fullWidth
                                            required
                                            variant="outlined"
                                            sx={{ bgcolor: 'white' }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <TextField
                                            name="stock"
                                            label="Stock"
                                            type="number"
                                            value={editForm.stock}
                                            onChange={handleFormChange}
                                            fullWidth
                                            required
                                            variant="outlined"
                                            sx={{ bgcolor: 'white' }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth required sx={{ bgcolor: 'white' }}>
                                            <InputLabel>Category</InputLabel>
                                            <Select
                                                value={editForm.category}
                                                onChange={handleCategoryChange}
                                                label="Category"
                                                renderValue={() => editForm.categoryName || ""}
                                            >
                                                {fetchedCategories?.data?.map((cat) => (
                                                    <MenuItem key={cat._id} value={String(cat._id)}>
                                                        <Box sx={{ 
                                                            display: "flex", 
                                                            justifyContent: "space-between",
                                                            alignItems: "center",
                                                            width: '100%'
                                                        }}>
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
                                                        </Box>
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            name="description"
                                            label="Description"
                                            value={editForm.description}
                                            onChange={handleFormChange}
                                            fullWidth
                                            multiline
                                            rows={4}
                                            variant="outlined"
                                            sx={{ bgcolor: 'white' }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Box sx={{ 
                                            p: 2, 
                                            border: '1px dashed',
                                            borderColor: 'divider',
                                            borderRadius: 1,
                                            bgcolor: 'white'
                                        }}>
                                            <Typography variant="subtitle2" sx={{ mb: 2 }}>Current Images</Typography>
                                            <Grid container spacing={2} sx={{ mb: 2 }}>
                                                {editForm.images.map((img, index) => (
                                                    <Grid item key={index} xs={6} sm={4} md={3}>
                                                        <Box sx={{ position: 'relative' }}>
                                                            <img 
                                                                src={img} 
                                                                alt={`Product ${index}`} 
                                                                style={{ 
                                                                    width: '100%', 
                                                                    height: '100px', 
                                                                    objectFit: 'contain' 
                                                                }} 
                                                            />
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleDeleteImage(img)}
                                                                sx={{
                                                                    position: 'absolute',
                                                                    top: 4,
                                                                    right: 4,
                                                                    bgcolor: 'rgba(255,255,255,0.8)',
                                                                    '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
                                                                }}
                                                            >
                                                                <DeleteIcon fontSize="small" />
                                                            </IconButton>
                                                        </Box>
                                                    </Grid>
                                                ))}
                                            </Grid>

                                            <Typography variant="subtitle2" sx={{ mb: 2 }}>Add New Images</Typography>
                                            <FileUpload
                                                name="images"
                                                accept="image/*"
                                                onSelect={handleImageChange}
                                                mode="basic"
                                                multiple
                                                chooseLabel="Add Images"
                                            />

                                            {newImages.length > 0 && (
                                                <Box sx={{ mt: 2 }}>
                                                    <Typography variant="subtitle2" sx={{ mb: 1 }}>New Images Preview</Typography>
                                                    <Grid container spacing={2}>
                                                        {newImages.map((img, index) => (
                                                            <Grid item key={index} xs={6} sm={4} md={3}>
                                                                <Box sx={{ position: 'relative' }}>
                                                                    <img 
                                                                        src={img} 
                                                                        alt={`New ${index}`} 
                                                                        style={{ 
                                                                            width: '100%', 
                                                                            height: '100px', 
                                                                            objectFit: 'contain' 
                                                                        }} 
                                                                    />
                                                                    <IconButton
                                                                        size="small"
                                                                        onClick={() => setNewImages(prev => prev.filter((_, i) => i !== index))}
                                                                        sx={{
                                                                            position: 'absolute',
                                                                            top: 4,
                                                                            right: 4,
                                                                            bgcolor: 'rgba(255,255,255,0.8)',
                                                                            '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
                                                                        }}
                                                                    >
                                                                        <DeleteIcon fontSize="small" />
                                                                    </IconButton>
                                                                </Box>
                                                            </Grid>
                                                        ))}
                                                    </Grid>
                                                </Box>
                                            )}
                                        </Box>
                                    </Grid>
                                </Grid>

                                <Box sx={{ 
                                    display: 'flex', 
                                    gap: 2, 
                                    mt: 3,
                                    justifyContent: 'flex-end' 
                                }}>
                                    <Button
                                        type="button"
                                        onClick={handleCancelClick}
                                        variant="outlined"
                                        startIcon={<CancelIcon />}
                                        sx={{ textTransform: 'none' }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={isUpdating}
                                        startIcon={<SaveIcon />}
                                        sx={{ textTransform: 'none' }}
                                    >
                                        {isUpdating ? "Saving..." : "Save Changes"}
                                    </Button>
                                </Box>
                            </form>
                        </Paper>
                    </Collapse>
                </td>
            ) : (
                <>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <Link 
                        to={`/product/${data._id}`}
                        sx={{
                            color: 'primary.main',
                            textDecoration: 'none',
                            fontWeight: 500,
                            '&:hover': {
                                textDecoration: 'underline',
                            }
                        }}
                    >
                        <Typography color="primary" sx={{ fontWeight: 500 }}>
                            {data.name}
                        </Typography>
                    </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <Typography sx={{ fontWeight: 500 }}>
                        {formatIndianPrice(data.price)}
                    </Typography>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {data.stock}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                            onClick={handleEditClick}
                            startIcon={<EditIcon />}
                            size="small"
                            sx={{ textTransform: 'none' }}
                        >
                            Edit
                        </Button>
                        <Button
                            onClick={() => handleDelete(data._id)}
                            startIcon={<DeleteIcon />}
                            color="error"
                            size="small"
                            sx={{ textTransform: 'none' }}
                        >
                            Delete
                        </Button>
                    </Box>
                </td>
            </>
        )}
    </tr>
    );
};

export default TableCard;