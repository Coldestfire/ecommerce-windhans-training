import { Link } from "react-router-dom";

const CategoryList = () => {
  const categories = [
    { label: "Electronics", value: "electronics" },
    { label: "Clothes", value: "clothes" },
    { label: "Home Appliances", value: "home-appliances" },
    { label: "Books", value: "books" },
    { label: "Toys", value: "toys" },
    { label: "Sports", value: "sports" }
  ];

  return (
    <div className="flex justify-evenly pt-3 pl-7">
        {categories.map((category) => (
          <div key={category.value}>
            <Link to={`/category/${category.value}`} className="category-link">
              {category.label}
            </Link>
          </div>
        ))}
    </div>
  );    
};

export default CategoryList;
