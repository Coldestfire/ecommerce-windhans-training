import { Link, useLocation } from "react-router-dom";

const CategoryList = () => {
  const location = useLocation();  // Get the current location
  const categories = [
    { label: "Electronics", value: "electronics" },
    { label: "Clothes", value: "clothes" },
    { label: "Home Appliances", value: "home-appliances" },
    { label: "Books", value: "books" },
    { label: "Toys", value: "toys" },
    { label: "Sports", value: "sports" }
  ];

  // Function to check if a category is the current active category
  const isActiveCategory = (categoryValue: string) => {
    return location.pathname.includes(categoryValue); // This checks if the URL matches the category
  };

  console.log(location.pathname);

  return (
    <div className="flex justify-evenly pt-3 ml-[10%]">
      {categories.map((category) => (
        <Link
          key={category.value}
          to={`/category/${category.value}`}
        >
          <div className={`hover:bg-gray-200 rounded-md px-7 py-3 mb-1 ${isActiveCategory(category.value) ? 'bg-gray-200' : ''}`}>
            {category.label}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CategoryList;
