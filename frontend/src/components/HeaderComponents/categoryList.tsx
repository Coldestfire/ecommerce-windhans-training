import { Link, useLocation, useNavigate } from "react-router-dom";
import { useGetCategoriesQuery } from "../../provider/queries/Category.query";
import Loader from "../Loader";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { useState, useEffect } from "react";

const CategoryList = () => {
  const { data, isLoading } = useGetCategoriesQuery({ category: "" });
  const location = useLocation(); // Tracks current URL location
  const navigate = useNavigate(); // Programmatic navigation

  // Hooks for categories and dropdown selection
  const categories = data?.data || [];
  const [selectedCategory, setSelectedCategory] = useState("");

  // Update the dropdown selection based on URL path
  useEffect(() => {
    const currentPath = decodeURIComponent(location.pathname); // Get path
    const activeCategory = categories.find((category: any) =>
      currentPath.includes(`/category/${category.name}`)
    );

    // Set the selected category dynamically based on URL
    setSelectedCategory(activeCategory ? activeCategory.name : "");
  }, [location.pathname, categories]); // Listen to pathname or categories change

  // Show loader while data is loading
  if (isLoading) {
    return <Loader />;
  }

  // Handle dropdown change
  const handleCategoryChange = (event: any) => {
    const value = event.target.value; // Get selected value
    setSelectedCategory(value); // Update dropdown state
    navigate(`/category/${value}`); // Navigate to new category URL
  };

  return (
    <div className="flex justify-center p-3">
      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel>Categories</InputLabel>
        <Select
          value={selectedCategory}
          onChange={handleCategoryChange} // Handle dropdown change
          label="Categories"
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 200, // Max height of dropdown
                overflowY: "auto", // Enables scroll if content overflows
              },
            },
          }}
        >
          {categories.map((category: any) => (
            <MenuItem key={category.name} value={category.name}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default CategoryList;
