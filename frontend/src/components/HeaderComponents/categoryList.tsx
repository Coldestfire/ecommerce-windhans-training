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
    
    if (value === "") {
      navigate('/home');
    } else {
      navigate(`/category/${value}`);
    }
  };

  if (isLoading) {
    return null;
  }

  // You can adjust these values to control the dropdown appearance
  const MENU_CONFIG = {
    maxHeight: '150px',        // Maximum height of the dropdown
    itemPadding: '8px 16px',   // Padding for each menu item
    scrollbarWidth: '3px',     // Width of the scrollbar
    scrollbarRadius: '3px'     // Border radius of the scrollbar
  };

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
              maxHeight: MENU_CONFIG.maxHeight, // Configurable maximum height
              mt: 0.5,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              borderRadius: 2,
              '& .MuiMenuItem-root': {
                padding: MENU_CONFIG.itemPadding, // Configurable padding
              },
              // Custom scrollbar styling
              '& .MuiList-root': {
                padding: 0,
                '&::-webkit-scrollbar': {
                  width: MENU_CONFIG.scrollbarWidth
                },
                '&::-webkit-scrollbar-track': {
                  background: '#f1f1f1',
                  borderRadius: MENU_CONFIG.scrollbarRadius
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#888',
                  borderRadius: MENU_CONFIG.scrollbarRadius,
                  '&:hover': {
                    background: '#666'
                  }
                }
              }
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