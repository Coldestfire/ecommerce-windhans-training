import { Link, useLocation } from "react-router-dom";
import { useGetCategoriesQuery } from "../../provider/queries/Category.query";
import Loader from "../Loader";

const CategoryList = () => {
  const { data, isLoading } = useGetCategoriesQuery({category:""});
  const location = useLocation();  // Get the current location
  
  if(isLoading){
    return <Loader />
  }

  const categories = data?.data || [];

  categories.map((category : any)=>{
    console.log("from categorylist: ", category.name);
  })

  // Function to check if a category is the current active category
  const isActiveCategory = (categoryValue: string) => {
    const currentPath = decodeURIComponent(location.pathname); // Decode special characters
    return currentPath.includes(`/category/${categoryValue}`);
  };

  return (
    <div className="flex justify-evenly space-x-5 pt-3 ml-[15%]">
      {categories.map((category: any) => (
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
