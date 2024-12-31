import { useLocation, useNavigate } from "react-router-dom";
import { useGetCategoriesQuery } from "../../provider/queries/Category.query";
import { Select, MenuItem, FormControl } from "@mui/material";
import { useState, useEffect } from "react";

const CategoryList = () => {
  const { data, isLoading } = useGetCategoriesQuery({ category: "" });
  const location = useLocation();
  const navigate = useNavigate();
  const categories = data?.data || [];
  const [selectedCategory, setSelectedCategory] = useState("");

  // Update the dropdown selection based on URL path
  useEffect(() => {
    const currentPath = decodeURIComponent(location.pathname);
    const activeCategory = categories.find((category: any) =>
      currentPath.includes(`/category/${category.name}`)
    );
    setSelectedCategory(activeCategory ? activeCategory.name : "");
  }, [location.pathname, categories]);

  // Handle dropdown change
  const handleCategoryChange = (event: any) => {
    const value = event.target.value;
    setSelectedCategory(value);
    
    // Navigate to home if "All Categories" is selected, otherwise go to category page
    if (value === "") {
      navigate('/home');
    } else {
      navigate(`/category/${value}`);
    }
  };

  if (isLoading) {
    return null; // Or a small loading indicator if preferred
  }

  return (
    <FormControl sx={{ minWidth: 150 }}>
      <Select
        value={selectedCategory}
        onChange={handleCategoryChange}
        displayEmpty
        size="small"
        sx={{
          '& .MuiSelect-select': {
            color: 'text.primary',
            fontWeight: 500,
            py: 1,
          },
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none'
          },
          '&:hover': {
            backgroundColor: 'rgba(0,0,0,0.04)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            border: 'none'
          }
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              maxHeight: 300,
              mt: 0.5,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              borderRadius: 2
            }
          }
        }}
      >
        <MenuItem value="" sx={{ fontWeight: 500 }}>
          All Categories
        </MenuItem>
        {categories.map((category: any) => (
          <MenuItem 
            key={category.name} 
            value={category.name}
            sx={{ 
              fontWeight: 500,
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.04)'
              }
            }}
          >
            {category.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CategoryList;