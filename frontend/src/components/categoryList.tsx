import { Link, useLocation } from "react-router-dom";
import { useGetCategoriesQuery } from "../provider/queries/Category.query";
import Loader from "./Loader";

const CategoryList = () => {
  const { data, isLoading, isError } = useGetCategoriesQuery({category:""});
  const location = useLocation();  // Get the current location
  
  if(isLoading){
    return <Loader />
  }

  const categories = data?.data || [];

  categories.map((category)=>{
    console.log("from categorylist: ", category.name);
  })

  // const categories = [
  //   { label: "Electronics", value: "electronics" },
  //   { label: "Clothes", value: "clothes" },
  //   { label: "Home Appliances", value: "home-appliances" },
  //   { label: "Books", value: "books" },
  //   { label: "Toys", value: "toys" },
  //   { label: "Sports", value: "sports" }
  // ];

  // Function to check if a category is the current active category
  const isActiveCategory = (categoryValue: string) => {
    return location.pathname.includes(categoryValue); // This checks if the URL matches the category
  };

  return (
    <div className="flex justify-evenly space-x-5 pt-3 ml-[15%]">
      {categories.map((category) => (
        <Link
          key={category.name}
          to={`/category/${category.name}`}
        >
          <div className={`hover:bg-gray-200 rounded-md px-7 py-3 mb-1 ${isActiveCategory(category.name) ? 'bg-gray-200' : ''}`}>
            {category.name}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CategoryList;
